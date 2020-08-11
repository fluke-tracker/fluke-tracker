import pandas as pd

# Directory of test and train images in AWS sagemaker
TRN_IMGS_DIR = '/opt/ml/input/data/train'
TST_IMGS_DIR = '/opt/ml/input/data/eval'
# Directory with image and validation lists
LIST_DIR = 'image_list'


def load_label_dict(label_list_path):
    f = open(label_list_path, 'r')
    lines = f.readlines()
    f.close()

    label_dict = {}
    for line in lines:
        line = line.strip()
        line = line.split(' ')
        id = line[0]
        index = int(line[1])
        label_dict[id] = index

    return label_dict


def read_txt(txt):
    f = open(txt, 'r')
    lines = f.readlines()
    f.close()
    lines = [tmp.strip() for tmp in lines]

    list = []
    for line in lines:
        line = line.split(' ')
        list.append([line[0], int(line[1])])

    return list


def load_train_list(train_image_list_path=LIST_DIR + r'/train_image_list_gdsc.txt'):
    f = open(train_image_list_path, 'r')
    lines = f.readlines()
    f.close()

    list = []
    for line in lines:
        line = line.strip()
        line = line.split(' ')
        img_name = line[0]
        index = int(line[1])
        list.append([img_name, index])
    return list


def image_list2dict(image_list):
    dict = {}
    id_list = []
    for image, id in image_list:
        if id in dict:
            dict[id].append(image)
        else:
            dict[id] = [image]
            id_list.append(id)

    return dict, id_list


