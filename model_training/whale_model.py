import argparse
import torch
import os
from torch.utils.data import DataLoader
from utils import *
from process.data import *
from timeit import default_timer as timer
from process.triplet_sampler import *
from loss.loss import softmax_loss, TripletLoss, focal_OHEM, l2_norm, euclidean_dist
import numpy as np
import pandas as pd

# Number of ids in training set
whale_id_num = 2568
# Doubled for flipping images
class_num = whale_id_num * 2


def get_model(model, config):
    """
    Import correct model type
    """
    if model == 'resnet101':
        from net.model_resnet101 import Net
    elif model == 'resnet152':
        from net.model_resnet152 import Net
    elif model == 'seresnet101':
        from net.model_seresnet101 import Net
    elif model == 'seresnext101':
        from net.model_seresnext101 import Net

    net = Net(num_class=class_num, s1=config.s1, m1=config.m1, s2=config.s2, emb_size=config.embedding_size)
    return net


def adjust_lr_and_hard_ratio(optimizer, ep):
    """
    Learning rate scheduler and updates the hard_ratio for hard example mining
    """
    if ep < 10:
        lr = 1e-4 * (ep // 5 + 1)
        hard_ratio = 1 * 1e-2
    elif ep < 50:
        lr = 3e-4
        hard_ratio = 7 * 1e-3
    elif ep < 60:
        lr = 1e-4
        hard_ratio = 6 * 1e-3
    elif ep < 70:
        lr = 5e-5
        hard_ratio = 5 * 1e-3
    else:
        lr = 1e-5
        hard_ratio = 4 * 1e-3
    for p in optimizer.param_groups:
        p['lr'] = lr
    return lr, hard_ratio


class WhaleModel:

    def __init__(self, config):
        self.model_type = config.model
        self.base_lr = 30e-5
        self.hard_ratio = 1 * 1e-2
        self.batch_size = config.batch_size
        self.epochs = config.train_epoch
        self.early_stopping_epochs = config.early_stopping
        self.embedding_size = config.embedding_size
        self.image_size = (config.image_h, config.image_w)
        self.label_counts = pd.read_csv('image_list/label_counts.csv', names=['label', 'counts'])
        self.NUM_INSTANCE = config.num_instance
        config.model_name = config.model + '_fold' + str(config.fold_index) + \
                            '_' + str(config.image_h) + '_' + str(config.image_w)

        # Correcting pseudo batch size
        self.pseudo_batch_ratio = 1
        self.batch_count = 0
        if config.pseudo_batch_size == 0:
            self.pseudo_batch_size = self.batch_size
        elif config.pseudo_batch_size <= self.batch_size:
            print("Pseudo batch size below or equal to batch size and will thus have no effect.")
            self.pseudo_batch_size = self.batch_size
        else:
            self.pseudo_batch_ratio = np.ceil(config.pseudo_batch_size / self.batch_size)
            print(f"Pseudo batch ratio calculation: ceil({config.pseudo_batch_size}/{self.batch_size})={self.pseudo_batch_ratio}")
            self.pseudo_batch_size = int(self.pseudo_batch_ratio * self.batch_size)
            print(f"Actual pseudo batch size will then be: {self.pseudo_batch_size}")

        self.out_dir = os.path.join('/opt/ml/model/', config.model_name)
        # Create output folders
        make_train_dirs(self.out_dir)

        # Load model
        self.model = get_model(config.model, config)
        # Freeze first layers
        for p in self.model.basemodel.layer0.parameters():
            p.requires_grad = False
        for p in self.model.basemodel.layer1.parameters():
            p.requires_grad = False

        self.model = torch.nn.DataParallel(self.model)
        # Check if GPU is available
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print('Using:', self.device)
        self.model = self.model.to(self.device)

        # Load weights of pretrained model when available
        if config.pretrained_model is not None:
            initial_checkpoint = os.path.join(self.out_dir, 'checkpoint', config.pretrained_model)
        else:
            initial_checkpoint = None
        if initial_checkpoint is not None:
            self.model.load_state_dict(torch.load(initial_checkpoint, map_location=lambda storage, loc: storage))

        self.optimizer = torch.optim.Adam(filter(lambda p: p.requires_grad, self.model.parameters()),
                                          lr=self.base_lr, betas=(0.9, 0.999), eps=1e-08, weight_decay=0.0002)

        # Weights for weighted combination of loss functions
        self.focal_w = config.focal_w
        self.softmax_w = config.softmax_w
        self.triplet_w = config.triplet_w

        # Best validation scores initiated
        self.max_acc_score = 0.0
        self.max_gdsc_score = 0.0
        self.min_focal_score = 100.0
        # Early stopping
        self.epochs_since_improvement = 0
        # Save argparse object
        self.hparams = config
        # Lists for saving training and validation statistics
        self.train_losses = []
        self.val_losses = []

        if config.mode == 'train' or config.mode == 'test':
            self.prepare_train_test()
        elif config.mode == 'inference':
            self.prepare_inference()

    def prepare_train_test(self):
        """
        Prepares dataloaders for training and testing of the model
        """
        self.train_dataset = WhaleDataset('train', fold_index=self.hparams.fold_index, image_size=self.image_size,
                                          class_num=whale_id_num)

        self.train_list = WhaleDataset('train_list', fold_index=self.hparams.fold_index, image_size=self.image_size,
                                       class_num=whale_id_num)

        self.valid_dataset = WhaleDataset('val', fold_index=self.hparams.fold_index, image_size=self.image_size,
                                          augment=[0.0], is_flip=False, class_num=whale_id_num)

        self.valid_dataset_flip = WhaleDataset('val', fold_index=self.hparams.fold_index, image_size=self.image_size,
                                               augment=[0.0], is_flip=True, class_num=whale_id_num)

        self.valid_loader = DataLoader(self.valid_dataset, shuffle=False, batch_size=self.batch_size,
                                       drop_last=False, num_workers=16, pin_memory=True)

        self.valid_loader_flip = DataLoader(self.valid_dataset_flip, shuffle=False, batch_size=self.batch_size,
                                            drop_last=False, num_workers=16, pin_memory=True)

        self.train_test_data = WhaleDataset('test_train', fold_index=self.hparams.fold_index,
                                            image_size=self.image_size, augment=[0], class_num=whale_id_num)

        self.test_data = WhaleDataset('test', fold_index=self.hparams.fold_index,
                                      image_size=self.image_size, augment=[0], class_num=whale_id_num)

        self.train_test_loader = DataLoader(self.train_test_data, shuffle=False, batch_size=self.batch_size,
                                            drop_last=False, num_workers=8, pin_memory=True)

        self.test_loader = DataLoader(self.test_data, shuffle=False, batch_size=self.batch_size,
                                      drop_last=False, num_workers=8, pin_memory=True)

    def prepare_inference(self):
        """
        Prepares dataloaders for inference
        """
        self.infer_data = WhaleDataset('test', fold_index=self.hparams.fold_index,
                                      image_size=self.image_size, augment=[0], class_num=whale_id_num)

        self.infer_loader = DataLoader(self.infer_data, shuffle=False, batch_size=self.batch_size,
                                      drop_last=False, num_workers=8, pin_memory=True)

    def one_hot(self, tensor):
        """
        One hot encodes a tensor

        :param tensor: Tensor with labels
        :return: One hot encoded tensor
        """
        onehot = torch.FloatTensor(len(tensor), class_num + 1).to(tensor.device)
        onehot.zero_()
        onehot.scatter_(1, tensor.view(-1, 1), 1)
        onehot = onehot[:, :class_num]
        return onehot

    def train(self):
        """
        Main training function for the model

        Should be called from a main function to initiate training

        Weights from best validation models are saved to file and can be used for testing
        """
        start = timer()
        improved = False
        glob_iter = 0

        for epoch in range(self.epochs):
            self.optimizer.zero_grad()
            # Update lr and hard example mining difficulty
            rate, self.hard_ratio = adjust_lr_and_hard_ratio(self.optimizer, epoch + 1)
            print(f'LR: {rate}, HR: {self.hard_ratio}')
            # Initiate train loader with triplet sampler
            train_loader = DataLoader(self.train_dataset,
                                      sampler=WhaleRandomIdentitySampler(self.train_list, self.batch_size,
                                                                         self.NUM_INSTANCE),
                                      batch_size=self.batch_size, drop_last=False, num_workers=16, pin_memory=True)
            epoch_stats = []
            # Train epoch on batches
            for i, (images, truth_) in enumerate(train_loader):
                glob_iter += 1
                # Train single batch
                losses = self.train_batch((images, truth_))
                epoch_stats.append(losses)

                # Print statistics
                if i % 10 == 0:
                    t = time_to_str((timer() - start), 'min')
                    print(f'Epoch {epoch + 1}, Batch number: {i}, Time: {t}')
                    print(f'Loss: {losses[0]:.4f}, Focal: {losses[1]:.4f}, Softmax: {losses[2]:.4f}, '
                          f'Triplet: {losses[3]:.4f}, top1: {100 * losses[4]:.2f}, top5: {100 * losses[5]:.2f}')

                # Validate every 100th batch after 10 epochs
                if (epoch + 1) > 10 and (glob_iter % 100 == 0):
                    # Validate and check if max validation score improved
                    improved_on_val = self.validate(start, epoch, i)
                    if improved_on_val:
                        # Improved on max validation score this epoch
                        improved = True

            epoch_stats = np.array(epoch_stats)
            self.train_losses.append(epoch_stats.mean(axis=1))

            # Save weights at interval
            if epoch + 1 % self.hparams.iter_save_interval == 0:
                torch.save(self.model.state_dict(), self.out_dir + f'/checkpoint/epoch_{epoch + 1}_model.pth')

            # End of epoch validation, and check for improvement on max validation score
            improved_on_val = self.validate(start, epoch, 0, save_stats=True)
            if improved_on_val:
                # Improved on max validation score this epoch
                improved = True

            # Check for validation improvements
            if improved:
                self.epochs_since_improvement = 0
                improved = False
            else:
                self.epochs_since_improvement += 1
                improved = False
            # Check for early stopping
            if self.epochs_since_improvement > self.early_stopping_epochs:
                print(f'Early stopping, no improvement on validation in {self.early_stopping_epochs} epochs')
                break

        print(f'Accuracy: {self.max_acc_score}, GDSC: {self.max_gdsc_score}, Focal: {self.min_focal_score}')
        self.train_losses = np.array(self.train_losses)
        self.val_losses = np.array(self.val_losses)
        # Save stats
        np.save(os.path.join(self.out_dir, "train_losses.npy"), self.train_losses)
        np.save(os.path.join(self.out_dir, "val_losses.npy"), self.val_losses)

        # Save final model
        print('Saving final model')
        torch.save(self.model.state_dict(), self.out_dir + '/checkpoint/final_model.pth')

    def train_batch(self, batch):
        """
        Train on a single batch of images and labels

        :param batch: Batch of images and labels from the training dataloader
        :return: Numpy array of losses and precision scores used for printing and plotting statistics
        """
        images, truth_ = batch
        self.model.train()
        # Prepare tensors
        truth = self.one_hot(truth_)
        images = to_var(images.to(self.device))
        truth = to_var(truth.to(self.device))
        truth_ = to_var(truth_.to(self.device))
        # Create embeddings and logits
        logit, logit_softmax, embeddings = self.model.forward(images, label=truth_, is_infer=True)
        # Calculate losses
        loss_focal = focal_OHEM(logit, truth_, truth, class_num, self.hard_ratio)
        loss_softmax = softmax_loss(logit_softmax, truth_)
        loss_triplet = TripletLoss(margin=0.3)(embeddings, truth_)
        # Weighted total loss
        loss = (loss_focal * self.focal_w + loss_softmax * self.softmax_w + loss_triplet * self.triplet_w) / self.pseudo_batch_ratio
        # Precision scores (top1 and top5)
        prob = torch.sigmoid(logit)
        top1, top5 = top_preds(prob, truth_)
        # Calculating gradients
        loss.backward()
        # Using a pseudo batch size for gradient updates
        self.batch_count += len(images)
        if self.batch_count >= self.pseudo_batch_size:
            self.optimizer.step()
            self.optimizer.zero_grad()
            self.batch_count = 0

        losses = np.array((loss.data.cpu().numpy(),
                           loss_focal.data.cpu().numpy(),
                           loss_softmax.data.cpu().numpy(),
                           loss_triplet.data.cpu().numpy(),
                           top1, top5)).reshape([6])
        return losses

    def validate(self, start, epoch, i, save_stats=False):
        """
        Starts validation during training

        :param start: Start time of training, for printing
        :param epoch: Current epoch number
        :param i: Current batch number
        :param save_stats: Save statistics for plotting after training
        :return: If validation scores where improved (True/False)
        """
        self.model.eval()
        valid_loss = self.do_validation(is_flip=False)

        # Optional to validate on flipped dataset
        # valid_loss_flip = self.do_validation(is_flip=True)
        # valid_loss = (valid_loss + valid_loss_flip) / 2.0

        # Save for plotting training progression
        if save_stats:
            self.val_losses.append(valid_loss)
            t = time_to_str((timer() - start), 'min')
            print(f'Epoch {epoch + 1}, Time: {t}')
            print(f'Validation focal loss: {valid_loss[0]:.4f}, '
                  f'Accuracy: {100 * valid_loss[1]:.2f}, GDSC Score: {valid_loss[2]:.2f}')
        else:
            t = time_to_str((timer() - start), 'min')
            print(f'Epoch {epoch + 1}, Batch number: {i}, Time: {t}')
            print(f'Validation focal loss: {valid_loss[0]:.4f}, '
                  f'Accuracy: {100 * valid_loss[1]:.2f}, GDSC Score: {valid_loss[2]:.2f}')
        # Set model back to training mode
        self.model.train()
        improved = False
        if self.min_focal_score > valid_loss[0]:
            self.min_focal_score = valid_loss[0]
            print('New max focal score, saving model')
            torch.save(self.model.state_dict(), self.out_dir + '/checkpoint/min_focal_valid_model.pth')
            improved = True

        if self.max_acc_score < valid_loss[1]:
            self.max_acc_score = valid_loss[1]
            print('New max accuracy score, saving model')
            torch.save(self.model.state_dict(), self.out_dir + '/checkpoint/max_acc_valid_model.pth')
            improved = True

        if self.max_gdsc_score < valid_loss[2]:
            self.max_gdsc_score = valid_loss[2]
            print('New max gdsc score, saving model')
            torch.save(self.model.state_dict(), self.out_dir + '/checkpoint/max_gdsc_valid_model.pth')
            improved = True

        return improved

    def do_validation(self, is_flip):
        """
        Gets embeddings from validation data and calculates validation scores

        :param is_flip: Validate on regular or flipped dataset (True/False)
        :return: numpy array with focal loss, accuracy and GDSC score from validation
        """
        # Select correct dataloader
        if is_flip:
            loader = self.valid_loader_flip
        else:
            loader = self.valid_loader

        embeddings_train = []
        labels_train = []
        embeddings_val = []
        labels_val = []
        losses = []
        probs = []

        with torch.no_grad():
            # Get embeddings from training data
            for files, images, labels in self.train_test_loader:
                images = to_var(images.to(self.device))
                logit, logit_softmax, embeddings = self.model.forward(images, label=None, is_infer=True)
                embeddings_train.append(embeddings.data.cpu().numpy())
                labels_train.append(labels)

            # Get embeddings and focal loss from validation data
            for images, labels in loader:
                # Prepare tensors
                truth = self.one_hot(labels)
                images = to_var(images.to(self.device))
                truth = to_var(truth.to(self.device))
                labels = to_var(labels.to(self.device))
                # Create embeddings and logits
                logit, _, embeddings = self.model(images, label=None, is_infer=True)
                loss = focal_OHEM(logit, labels, truth, self.hard_ratio)
                label = labels.data.cpu().numpy()
                prob = torch.sigmoid(logit)
                prob = prob.data.cpu().numpy()
                # Softmax output is dependant on if the images are flipped
                if is_flip:
                    label -= whale_id_num
                else:
                    label[label == class_num] = whale_id_num
                # Save for final calculation
                embeddings_val.append(embeddings.data.cpu().numpy())
                labels_val.append(label)
                loss_tmp = loss.data.cpu().numpy().reshape([1])
                losses.append(loss_tmp)

        # Calculate mean focal loss
        loss = np.concatenate(losses, axis=0)
        loss = loss.mean()
        # Concatenate arrays from validation batches
        embeddings_train = np.concatenate(embeddings_train)
        labels_train = np.concatenate(labels_train)
        embeddings_val = np.concatenate(embeddings_val)
        labels_val = np.concatenate(labels_val)
        # Normalize embeddings
        embeddings_train = l2_norm(torch.from_numpy(embeddings_train))
        embeddings_val = l2_norm(torch.from_numpy(embeddings_val))
        # Create distance matrix
        distmat = euclidean_dist(embeddings_val, embeddings_train)
        distances = distmat.numpy()
        # Get indices of best matches
        top20 = distances.argsort(axis=1)[:, 1:21]

        score = 0
        correct = 0
        val_with_match = 0
        for i in range(top20.shape[0]):
            # Label of i-th image in validation set
            label = labels_val[i]
            # Number of possible matches
            possible_matches = self.label_counts[self.label_counts.label == label].counts.values[0] - 1
            if possible_matches > 0:
                val_with_match += 1
                # Most similar is a match
                if label == labels_train[top20[i, 0]]:
                    correct += 1
                # Create list of match/not match from top 20 predictions
                is_match = []
                for j in range(top20.shape[1]):
                    pred = labels_train[top20[i, j]]
                    if pred == label:
                        is_match.append(1)
                    else:
                        is_match.append(0)
                # GDSC scoring function
                f1_1 = f1_at_n(is_match, possible_matches, 1)
                f1_2 = f1_at_n(is_match, possible_matches, 2)
                f1_3 = f1_at_n(is_match, possible_matches, 3)
                f1_20 = f1_at_n(is_match, possible_matches, 20)
                score += 10 * f1_1 + 5 * f1_2 + 2 * f1_3 + f1_20
        accuracy = correct / val_with_match
        return np.array([loss, accuracy, score])

    def test(self, outfile_name="submission.csv"):
        """
        Create embeddings for all images and create submission file for GDSC

        :param outfile_name: Filename of submission file
        """
        self.model.eval()

        embeddings_train = []
        filenames_train = []
        ids_train = []
        embeddings_test = []
        filenames_test = []
        softmax_test = []

        with torch.no_grad():
            print('Getting train embeddings')
            i = 0
            batches = int(len(self.train_test_data) / self.batch_size)
            # Get train and validation embeddings
            for files, images, labels in self.train_test_loader:
                images = to_var(images.to(self.device))
                logit, logit_softmax, embeddings = self.model.forward(images, label=None, is_infer=True)
                embeddings_train.append(embeddings.data.cpu().numpy())
                filenames_train.append(files)
                ids_train.append(labels)
                if i % 10 == 0:
                    print(f'Batch {i} of {batches} completed')
                i += 1
            print('Getting test embeddings')
            i = 0
            batches = int(len(self.test_data) / self.batch_size)
            # Get test embeddings
            for files, images in self.test_loader:
                images = to_var(images.to(self.device))
                logit, logit_softmax, embeddings = self.model.forward(images, label=None, is_infer=True)
                prob = torch.sigmoid(logit)
                embeddings_test.append(embeddings.data.cpu().numpy())
                filenames_test.append(files)
                softmax_test.append(prob.data.cpu().numpy())

                if i % 10 == 0:
                    print(f'Batch {i} of {batches} completed')
                i += 1
        # Concatenate arrays from test batches
        embeddings_train = np.concatenate(embeddings_train)
        filenames_train = np.concatenate(filenames_train)
        embeddings_test = np.concatenate(embeddings_test)
        filenames_test = np.concatenate(filenames_test)

        # Create embedding lists
        embeddings_train = torch.from_numpy(embeddings_train)
        # Normalize embeddings
        embeddings_test = l2_norm(torch.from_numpy(embeddings_test))
        embeddings_full = l2_norm(torch.cat((embeddings_train, embeddings_test), 0))
        # Create distance matrix
        distmat_full = euclidean_dist(embeddings_test, embeddings_full)
        distances_full = distmat_full.numpy()
        # Get indices of best matches
        top20_full = distances_full.argsort(axis=1)[:, :21]
        df_list = []
        for i in range(top20_full.shape[0]):
            img = []
            for j in range(top20_full.shape[1]):
                idx = top20_full[i, j]
                # 3868 is the number of images in the train set
                if idx >= 4493:
                    img.append(filenames_test[idx - 4493])
                else:
                    img.append(filenames_train[idx].split('/')[1])
            df_list.append(img)
        # Use Pandas dataframe to create .csv submission
        df = pd.DataFrame(df_list)
        print(df.head())
        df.to_csv(os.path.join(self.out_dir, outfile_name), header=False, index=False)

    def create_embeddings(self):
        """
        Create embeddings for all images and returns them

        """
        self.model.eval()
        embeddings = []
        filenames = []

        with torch.no_grad():
            print('Getting embeddings')
            i = 0
            batches = int(len(self.infer_data) / self.batch_size)
            # Get embeddings from model
            for files, images in self.infer_loader:
                images = to_var(images.to(self.device))
                _, _, emb = self.model.forward(images, label=None, is_infer=True)
                embeddings.append(emb.data.cpu().numpy())
                filenames.append(files)

                if i % 10 == 0:
                    print(f'Batch {i} of {batches} completed')
                i += 1

        # Concatenate batches and normalize embeddings
        embeddings = np.concatenate(embeddings)
        embeddings = l2_norm(torch.from_numpy(embeddings)).numpy()
        filenames = np.concatenate(filenames)
        emb_dict = {}
        for i in range(filenames.shape[0]):
            emb_dict[filenames[i]] = embeddings[i].tolist()
        return emb_dict


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--fold_index', type=int, default=0)
    parser.add_argument('--model', type=str, default='resnet101')
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--pseudo_batch_size', type=int, default=0)

    parser.add_argument('--image_h', type=int, default=384)
    parser.add_argument('--image_w', type=int, default=768)

    parser.add_argument('--s1', type=float, default=64.0)
    parser.add_argument('--m1', type=float, default=0.5)
    parser.add_argument('--s2', type=float, default=16.0)

    parser.add_argument('--focal_w', type=float, default=1.0)
    parser.add_argument('--softmax_w', type=float, default=0.1)
    parser.add_argument('--triplet_w', type=float, default=1.0)

    parser.add_argument('--mode', type=str, default='train',
                        choices=['train', 'test', 'inference'])
    parser.add_argument('--pretrained_model', type=str, default=None)

    parser.add_argument('--embedding_size', type=int, default=2048)
    parser.add_argument('--num_instance', type=int, default=2)
    parser.add_argument('--iter_save_interval', type=int, default=5)
    parser.add_argument('--train_epoch', type=int, default=100)
    parser.add_argument('--early_stopping', type=int, default=5)
    parser.add_argument("--model_dir", type=str, default=os.environ.get("SM_MODEL_DIR"))

    args = parser.parse_args()
    print(args)
    model = WhaleModel(args)
    if args.mode == 'train':
        model.train()
    elif args.mode == 'test':
        model.test()

