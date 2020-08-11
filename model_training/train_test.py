import os
import argparse
from whale_model import WhaleModel


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--fold_index', type=int, default=0)
    parser.add_argument('--model', type=str, default='resnet101')
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--pseudo_batch_size', type=int, default=0)

    parser.add_argument('--image_h', type=int, default=256)
    parser.add_argument('--image_w', type=int, default=512)

    parser.add_argument('--s1', type=float, default=64.0)
    parser.add_argument('--m1', type=float, default=0.5)
    parser.add_argument('--s2', type=float, default=16.0)

    parser.add_argument('--focal_w', type=float, default=1.0)
    parser.add_argument('--softmax_w', type=float, default=0.1)
    parser.add_argument('--triplet_w', type=float, default=1.0)

    parser.add_argument('--is_pseudo', type=bool, default=False)

    parser.add_argument('--mode', type=str, default='train',
                        choices=['train', 'val', 'val_fold', 'test_classifier', 'test', 'test_fold'])
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

    model.train()

    print('Starting test...')
    args.mode = 'test'
    args.batch_size = 8

    args.pretrained_model = 'max_acc_valid_model.pth'
    model = WhaleModel(args)
    model.test(outfile_name='acc_submission.csv')

    args.pretrained_model = 'max_gdsc_valid_model.pth'
    model = WhaleModel(args)
    model.test(outfile_name='gdsc_submission.csv')

    args.pretrained_model = 'min_focal_valid_model.pth'
    model = WhaleModel(args)
    model.test(outfile_name='focal_submission.csv')