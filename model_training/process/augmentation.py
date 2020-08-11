import torch
from torchvision import transforms
import torchvision.transforms.functional as TF
import numpy as np
import random
from PIL import Image


class AddGaussianNoise(object):
    def __init__(self, mean=0., std=1.):
        self.std = std
        self.mean = mean

    def __call__(self, tensor):
        return tensor + torch.randn(tensor.size()) * self.std + self.mean

    def __repr__(self):
        return self.__class__.__name__ + '(mean={0}, std={1})'.format(self.mean, self.std)


def order_points(pts):
    # initialize a list of coordinates that will be ordered
    # such that the first entry in the list is the top-left,
    # the second entry is the top-right, the third is the
    # bottom-right, and the fourth is the bottom-left
    rect = np.zeros((4, 2), dtype="float32")
    # the top-left point will have the smallest sum, whereas
    # the bottom-right point will have the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    # now, compute the difference between the points, the
    # top-right point will have the smallest difference,
    # whereas the bottom-left will have the largest difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    # return the ordered coordinates
    return rect


def four_point_transform(image, pts, imshape):
    # obtain a consistent order of the points and unpack them
    # individually
    rect = order_points(pts)
    original = np.array([[0, 0],
                         [imshape[1] - 1, 0],
                         [imshape[1] - 1, imshape[0] - 1],
                         [0, imshape[0] - 1]], dtype="float32")

    warped = TF.perspective(image, original, rect)
    return np.asarray(warped)


def perspective_aug(img, threshold1=0.25, threshold2=0.75):
    imshape = np.asarray(img).shape
    rows, cols, ch = imshape
    # Find random points for the perspective change
    x0, y0 = random.randint(0, int(cols * threshold1)), random.randint(0, int(rows * threshold1))
    x1, y1 = random.randint(int(cols * threshold2), cols - 1), random.randint(0, int(rows * threshold1))
    x2, y2 = random.randint(int(cols * threshold2), cols - 1), random.randint(int(rows * threshold2), rows - 1)
    x3, y3 = random.randint(0, int(cols * threshold1)), random.randint(int(rows * threshold2), rows - 1)
    pts = np.float32([(x0, y0),
                      (x1, y1),
                      (x2, y2),
                      (x3, y3)])
    # Change the image perspective with points
    warped = four_point_transform(img, pts, imshape)

    x_ = np.asarray([x0, x1, x2, x3])
    y_ = np.asarray([y0, y1, y2, y3])

    min_x = np.min(x_)
    max_x = np.max(x_)
    min_y = np.min(y_)
    max_y = np.max(y_)
    # Crop image to points
    warped = warped[min_y:max_y, min_x:max_x, :]
    return Image.fromarray(warped)


def aug_image(image, is_infer=False, augment=None):
    if is_infer:
        # No augmentation during inference
        # Apply flipping for validation of flipped images
        flip_code = augment[0]

        if flip_code == 1:
            image = TF.hflip(image)
        elif flip_code == 2:
            image = TF.vflip(image)
        elif flip_code == 3:
            image = TF.vflip(image)
            image = TF.hflip(image)
        elif flip_code == 0:
            return image

    else:
        # Random amount of distortion in second perspective transform
        dist_scale = random.random() / 10 + 0.01
        # Amount of augmentation
        aug_factor = 1.5
        # Set of transformation to made on the images
        transform = transforms.Compose([
            transforms.RandomAffine(degrees=(-15, 15),
                                    shear=(-20, 20)),
            transforms.RandomOrder([
                transforms.RandomApply([transforms.ColorJitter(brightness=0.1*aug_factor,
                                                               contrast=0.1*aug_factor)], p=0.2),
                transforms.RandomApply([transforms.ColorJitter(saturation=0.1*aug_factor,
                                                               hue=0.1*aug_factor)], p=0.5),
                transforms.RandomPerspective(distortion_scale=dist_scale*aug_factor, p=0.5)#,
                #transforms.RandomApply([transforms.Compose([
                #    transforms.ToTensor(),
                #    transforms.RandomErasing(p=1.0, scale=(0.02, 0.1), ratio=(0.25, 1)),
                #    transforms.ToPILImage()
                #])], p=0.7),
                #transforms.RandomApply([transforms.Compose([
                #    transforms.ToTensor(),
                #    AddGaussianNoise(0., 2.),
                #    transforms.ToPILImage()
                #])], p=0.5)
            ])
        ])
        image = transform(image)
    # Return transformed image
    return image
