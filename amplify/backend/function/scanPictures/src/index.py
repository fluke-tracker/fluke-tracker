import io

import boto3


def handler(event, context):
    print('received event:')
    print(event)
    dynamodb = boto3.resource('dynamodb')
    #source_bucket = event['Records'][0]['s3']['bucket']['name']
    #key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'])
    #copy_source = {'Bucket': source_bucket, 'Key': key}

    print(context)

    s3 = boto3.client('s3')
    bucketname = "https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev.s3.eu-central-1.amazonaws.com/"
    bucketname2 = "whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev"
    itemname = "thumbnails/"
    #IMG_2270-16.jpgthumbnail.jpg
    for i, obj_ in enumerate(s3.list_objects(Bucket=bucketname2, Prefix=itemname)['Contents']):
        body = s3.get_object(Bucket=bucketname2, Key=obj_['Key'])['Body'].read()
        #body = obj.get()['Body'].read()
        import exifread
        tags = exifread.process_file(io.BytesIO(body))
        table = dynamodb.Table('Picture-25obaineebgpbamkjdlmt3tx6m-dev')
        table.put_item(
            Item={
                'id': str(i),
                'thumbnail': obj_['Key'] + 'thumbnail.jpg',
                'high_res': obj_['Key'],
                'filename': obj_['Key'].split("/")[-1],
                'whale': '123',
                'geocoords': str(tags.gps_latitude if 'gps_latitude' in tags else '') + ',' + str(tags.gps_longitude if 'gps_longitude' in tags else ''),
                'date_taken': tags.LastModified if 'LastModified' in tags else '',
                'embedding': '123',
                'uploaded_by': context.identity.cognito_identity_id if context else '',
            }
    )

    return {
        'message': 'Hello from your new Amplify Python lambda!'
    }


#handler({"filename": ""}, None)
