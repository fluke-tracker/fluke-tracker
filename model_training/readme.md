# Global Data Science Challenge - Capgemini
![Header](img1.png)
The Capgemini Global Data Science Challenge is a data science competition hosted by Capgemini in collaboration with AWS.

With a focus on environmental sustainability theme this years task was to build an AI that takes a picture of a sperm whale and finds all pictures that show the same whale. 
The dataset of whales was provided by sperm whale marine scientist, Lisa Steiner.


This code was used to train the models which produced the highest private leaderboard score in the competition,
and is used on the to find matches on the FlukeTracker website.

### Setup
Requirements for running the code are listed in the _requirements.txt_ file. These packages can be installed by running:

```
pip install -r requirements.txt
```

### Training Models
In order to train models the lists in the _image_list_ folder must be updated to match the dataset that will be used. 
* _train_image_list_gdsc.txt_ contains all image filenames, whale-id starting from 0 and the whale-id
* _valX.txt_ is similar, but specifies which images should be used for validation in fold X
* _label_list_gdsc.txt_ contains a mapping from whale-id starting from 0 to whale_id
* _label_counts_.csv_ contains information on how many images there are of each whale-id

After this is included model training can be started by running:

```
python whalemodel.py
```

Several command line options are available for configuring the model training, but the most important ones are listed here:
* **fold_index**: Specifies which validation fold should be used
* **model**: Used for selecting backbone model
* **batch_size**: Sets batch size
* **pseudo_batch_size**: Optional gradient accumulation
* **image_h** and **image_w**: Images are resized to these dimensions
* **mode**: Selects between train, test and inference
* **pretrained_model**: Optional filename of a pretrained model 
* **embedding_size**: Size om output 
* **train_epoch**: Number of training epochs
* **early_stopping**: Number of epochs without improvement before early stopping

### Testing models
Models can be tested by using the test mode and specifying the pretrained model that should be used. Optionally the model can be both trained and tested at the same time by running _train_test.py_