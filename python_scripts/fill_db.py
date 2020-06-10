# Use AWS4Auth to sign a requests session
import boto3
import requests
from requests_aws4auth import AWS4Auth

session = requests.Session()
credentials = boto3.session.Session().get_credentials()
client = boto3.client('cognito-idp')
client.initiate_auth(
    AuthFlow='USER_PASSWORD_AUTH',
    ClientId='4ifhmbqsgmcpc11efb90drbihk',
    AuthParameters={'USERNAME': 'moritz', 'PASSWORD': 'testtest'}
)
session.headers['authorization'] = boto3.client('sts').get_session_token()['Credentials']['SessionToken']
APPSYNC_API_ENDPOINT_URL = 'https://bmzqnf6tm5chrckn3hqlgwue4m.appsync-api.eu-central-1.amazonaws.com/graphql'

# setup the query string (optional)
query = """
getPicture(id: $id) {
      high_res
      thumbnail
      filename
      whale {
        name
        pictures {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      geocoords
      date_taken
      embedding
      uploaded_by
      matchLeft {
        picture1 {
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
          owner
        }
        picture2 {
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
          owner
        }
        match_status
        similarity_score
        createdAt
        updatedAt
        owner
      }
      matchRight {
        picture1 {
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
          owner
        }
        picture2 {
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
          owner
        }
        match_status
        similarity_score
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }"""

# Now we can simply post the request...
response = session.request(
    url=APPSYNC_API_ENDPOINT_URL,
    method='POST',
    headers={'x-api-key': '25obaineebgpbamkjdlmt3tx6m'},
    json={'query': query, 'variables': {'id': "PM-WWA-20180819-106.jpg"}}
)
print(response.text)


#import boto3

#dynamodb = boto3.resource('dynamodb')
#picture_table = dynamodb.Table('Picture-25obaineebgpbamkjdlmt3tx6m-dev')
#picture_name = "PM-WWA-20050413-003a.jpg"
#embedding = 1337
#print(picture_table.update_item(Key={"id": picture_name},
#                                UpdateExpression="set embedding=:embedding",
#                                ExpressionAttributeValues={":embedding": embedding},
#      ))




#for entry in csv_splitted:
#    whale_id = entry[ID]
#    for filename in entry[1:]:
#        result=picture_table.scan(
#                FilterExpression=Attr("filename").eq(filename + "thumbnail.jpg")
#        )
#        print(result)
#        if result['Items']:
#            response = picture_table.update_item(
#                Key={
#                   'id': result['Items'][0]['id']
#                },
#                UpdateExpression="set whale=:w",
#                ExpressionAttributeValues={
#                    ':w': whale_id
#                },
#            )
#        pass