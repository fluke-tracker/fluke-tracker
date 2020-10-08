import csv
import boto3
from decimal import Decimal
import pandas as pd
import json



def main():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Whale-huq5xsnrsnbgjcdbxlourmh5he-whaledev')
    with open('C:\\Users\\ksinghko\\Pictures\\Lisa New Pictures\\WWA_Images\\WWA\\book1.json') as jfile:
        dic = json.load(jfile)
    for x in dic:
        print(x)
        imagename=x.get('ImageName')+'.jpg'
        thumbnail_image = imagename + 'thumbnail.jpg'
        imageid=x.get(('AnimalID'))
        #pictureWhaleId=x.get('AnimalID')
        print(imagename)
        print(imageid)
        #additional = str({'pictureWhaleId': imageid})
        try:
            table.put_item(
                    Item={
                        'id': str(imageid),
                        'name': imageid,
                        'createdAt': '2020-04-10T16:49:42.406Z',
                        'uploadedAt': '2020-04-10T16:49:42.406Z',
                        'updatedAt': '2020-04-10T16:49:42.406Z',
                        'owner': 'kanwal',
                    })
        except:
            print("error")


if __name__ == '__main__':
    main()