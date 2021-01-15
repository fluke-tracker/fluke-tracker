import csv
import boto3
from decimal import Decimal
import pandas as pd
import json


def main():
    dynamodb = boto3.resource('dynamodb')
    #table = dynamodb.Table('Picture-huq5xsnrsnbgjcdbxlourmh5he-whaledev')
    table = dynamodb.Table('Picture-annjsugevjbtpi6ic5xg3qt244-whaleprod')
    with open('database.csv', "w") as file:
        result = table.scan()
        file.write(f"filename,whaleId")
        scan_kwargs = {
        }

        done = False
        start_key = None
        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = table.scan(**scan_kwargs)
            for entry in response['Items']:
                pictureWhaleId = entry['pictureWhaleId'] if "pictureWhaleId" in  entry else ""
                filename = entry['filename']
                file.write(f"\n{filename},{pictureWhaleId}")
            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None
        file.close()

if __name__ == '__main__':
    main()
