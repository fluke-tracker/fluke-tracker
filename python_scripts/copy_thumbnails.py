import shutil, os
import pandas as pd
import io,csv,json
import boto3

df = pd.read_csv('C:\\Users\ksinghko\\Pictures\\Lisa New Pictures\\WWA_Images\\WWA\\Book1.csv')
df = pd.DataFrame(df,columns=['ImageName'])

files = df.ImageName
print(files)
for f in files:
    shutil.copy(f, "C:\\Users\ksinghko\\Pictures\\Lisa New Pictures\\WWA_Images\\Thumbnails")


    