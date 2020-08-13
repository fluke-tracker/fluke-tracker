import csv
import boto3
from decimal import Decimal
import pandas as pd
import json
      
#df = pd.read_csv('euc_distances.csv')
with open('python_scripts/embeddings.json') as jfile:
    dic = json.load(jfile)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Picture-annjsugevjbtpi6ic5xg3qt244-whaleprod')

for k in dic.keys():
    embedding = [Decimal(str(d)) for d in dic[k]]
    table.update_item(Key={"id": k},
                        UpdateExpression="set embedding=:embedding",
                        ExpressionAttributeValues={":embedding": embedding})
