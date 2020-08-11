from process.data_helper import *
from process.augmentation import *
import torch
import torchvision.transforms.functional as TF
import os
import random
import numpy as np
from PIL import Image
from torch.utils.data.dataset import Dataset


class WhaleDataset(Dataset):
    def __init__(self, mode, fold_index='<NIL>', image_size=(256, 512),
                 augment=None,
                 is_flip=False,
                 class_num=2234):

        super(WhaleDataset, self).__init__()
        self.mode = mode
        self.augment = augment
        self.is_flip = is_flip
        self.classes = class_num

        self.label_dict = load_label_dict(os.path.join(LIST_DIR, r'label_list_gdsc.txt'))
        self.class_num = len(self.label_dict)
        print('Class num: ', self.class_num)

        self.train_image_path = TRN_IMGS_DIR
        self.test_image_path = TST_IMGS_DIR
        self.image_size = image_size
        self.fold_index = None
        self.set_mode(mode, fold_index)

    def set_mode(self, mode, fold_index):
        self.mode = mode
        self.fold_index = fold_index
        print('fold index set: ', fold_index)

        if self.mode == 'train' or self.mode == 'train_list':
            self.train_list = load_train_list()
            val_list = read_txt(LIST_DIR + '/val'+str(self.fold_index)+'.txt')
            print(LIST_DIR + '/val'+str(self.fold_index)+'.txt')
            val_set = set([tmp for tmp,_ in val_list])
            self.train_list = [tmp for tmp in self.train_list if tmp[0] not in val_set]
            self.train_dict, self.id_list = image_list2dict(self.train_list)
            self.num_data = len(self.train_list)*2
            print('set dataset mode: train')

        elif self.mode == 'val':
            self.val_list = read_txt(LIST_DIR + '/val'+str(self.fold_index)+'.txt')
            print(LIST_DIR + '/val'+str(self.fold_index)+'.txt')
            self.num_data = len(self.val_list)
            print('set dataset mode: val')

        elif self.mode == 'test':
            self.test_list = os.listdir(TST_IMGS_DIR)
            self.test_list = [tmp for tmp in self.test_list if '.jpg' in tmp]
            self.num_data = len(self.test_list)
            print('set dataset mode: test')

        elif self.mode == 'test_train':
            self.test_list = load_train_list()
            self.train_dict, self.id_list = image_list2dict(self.test_list)
            self.num_data = len(self.test_list)
            print('set dataset mode: test')

        print('data num: ' + str(self.num_data))

    def __getitem__(self, index):
        if self.fold_index is None:
            print('No fold index')
            return

        if self.mode == 'train':
            if index >= len(self.train_list):
                image_index = index - len(self.train_list)
            else:
                image_index = index

            image_tmp, label = self.train_list[image_index]
            image_path = os.path.join(self.train_image_path, image_tmp)

            if not os.path.exists(image_path):
                image_path = os.path.join(self.test_image_path, image_tmp)

            image = Image.open(image_path)

        if self.mode == 'train_list':
            if index >= len(self.train_list):
                image_index = index - len(self.train_list)
            else:
                image_index = index
            image_tmp, label = self.train_list[image_index]

            if index >= len(self.train_list):
                label += self.classes

            return None, label

        if self.mode == 'val':
            image_tmp, label = self.val_list[index]
            image_path = os.path.join(self.train_image_path, image_tmp)

            if not os.path.exists(image_path):
                image_path = os.path.join(self.test_image_path, image_tmp)

            image = Image.open(image_path)

        if self.mode == 'test':
            image_path = os.path.join(self.test_image_path, self.test_list[index])
            image = Image.open(image_path)

            image_id = self.test_list[index]
            image = image.resize((self.image_size[1], self.image_size[0]))
            image = aug_image(image, is_infer=True, augment=self.augment)
            image = np.asarray(image)
            image = np.transpose(image, (2, 0, 1))
            image = image.astype(np.float32)
            image = image.reshape([3, self.image_size[0], self.image_size[1]])
            image = image / 255.0

            return image_id, torch.FloatTensor(image)

        if self.mode == 'test_train':
            image_tmp, label = self.test_list[index]
            image_path = os.path.join(self.train_image_path, image_tmp)
            image = Image.open(image_path)

            image_id, label = self.test_list[index]
            image = image.resize((self.image_size[1], self.image_size[0]))
            image = aug_image(image, is_infer=True, augment=self.augment)
            image = np.asarray(image)
            image = np.transpose(image, (2, 0, 1))
            image = image.astype(np.float32)
            image = image.reshape([3, self.image_size[0], self.image_size[1]])
            image = image / 255.0

            return image_id, torch.FloatTensor(image), label

        image = image.resize((self.image_size[1], self.image_size[0]))

        if self.mode == 'train':
            if random.randint(0, 1) == 0:
                image = perspective_aug(image)
                image = image.resize((self.image_size[1], self.image_size[0]))

            image = aug_image(image)

            if index >= len(self.train_list):
                image = TF.hflip(image)
                label += self.classes

        elif self.mode == 'val':
            image = aug_image(image, is_infer=True, augment=self.augment)

            if self.is_flip:
                image = TF.hflip(image)

                if label != -1:
                    label += self.classes
        image = np.asarray(image)
        image = np.transpose(image, (2, 0, 1))
        image = image.astype(np.float32)
        image = image.reshape([-1, self.image_size[0], self.image_size[1]])
        image = image / 255.0

        return torch.FloatTensor(image), label

    def __len__(self):
        return self.num_data

