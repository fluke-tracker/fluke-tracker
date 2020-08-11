from torch.autograd import Variable
import torch
import numpy as np
import os


def to_var(x, volatile=False):
    """
    Tensor to Variable
    """
    if torch.cuda.is_available():
        x = x.cuda()
    return Variable(x, volatile=volatile)


def top_preds(preds, labels, k=5):
    """
    Top 1 and top k precision

    :param preds: Softmax output tensor with probabilities
    :param labels: Labels in batch
    :param k: top k precision, default top5
    :return:
    """
    correct = 0
    topk = 0
    for i in range(len(labels)):
        classes = (-preds[i]).argsort()
        if classes[0] == labels[i]:
            correct += 1
        for c in classes[:k]:
            if c == labels[i]:
                topk += 1
                break
    return correct / len(labels), topk / len(labels)


def make_train_dirs(out_dir):
    """
    Folder structure within the output folder

    Uses existing folders or creates new ones when there isn't any
    """
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
    if not os.path.exists(os.path.join(out_dir, 'checkpoint')):
        os.makedirs(os.path.join(out_dir, 'checkpoint'))
    if not os.path.exists(os.path.join(out_dir, 'train')):
        os.makedirs(os.path.join(out_dir, 'train'))
    if not os.path.exists(os.path.join(out_dir, 'backup')):
        os.makedirs(os.path.join(out_dir, 'backup'))


def time_to_str(t, mode='min'):
    if mode == 'min':
        t = int(t) / 60
        hr = t // 60
        min = t % 60
        return '%2d hr %02d min' % (hr, min)
    elif mode == 'sec':
        t = int(t)
        min = t // 60
        sec = t % 60
        return '%2d min %02d sec' % (min, sec)
    else:
        raise NotImplementedError


def f1_at_n(is_match, potential_matches, n):
    """
    Takes a boolean list denoting if the n-th entry of the predictions is an actual match
    and the number of potential matches, i.e. how many matches are at most possible and
    an integer n and computed the f1 score if one were to only consider the n most
    relevant matches
    :param is_match:
    :param potential_matches:
    :param n:
    :return:
    """
    if potential_matches == 0:
        return 0
    correct_prediction = float(sum(is_match[:n]))
    precision = correct_prediction / n
    recall = correct_prediction / potential_matches
    try:
        if (recall + precision) != 0.0:
            f1 = 2 * (recall * precision) / (recall + precision)
        else:
            f1 = 0
    except ZeroDivisionError:
        f1 = 0
    return f1



