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

    ids = set()
    ids_to_images = open("id_to_images.csv").read().split("\n")
    whale_image_to_id = {}
    for id_images in ids_to_images:
        if id_images:
            id_ = id_images.split(",")[0]
            whale_images = id_images.split(",")[1:]
            for whale_image in whale_images:
                whale_image_to_id[whale_image] = id_
                ids.add(id_)
    s3 = boto3.client('s3')
    bucketname = "https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev.s3.eu-central-1.amazonaws.com/"
    bucketname2 = "whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev"
    itemname = "thumbnails/"
    #IMG_2270-16.jpgthumbnail.jpg
    nextToken = None

    table = dynamodb.Table('Whale-25obaineebgpbamkjdlmt3tx6m-dev')
    for id_ in ids:
        table.put_item(
            Item={
                'id': id_,
                'name': id_,
                'uploaded_by': context.identity.cognito_identity_id if context else '',
                'createdAt': '2020-06-03T16:49:42.406Z',
                'uploadedAt': '2020-06-03T16:49:42.406Z',
                'updatedAt': '2020-06-03T16:49:42.406Z',
            })

    table = dynamodb.Table('Picture-25obaineebgpbamkjdlmt3tx6m-dev')
    while True:
        if nextToken:
            add = {"ContinuationToken": nextToken}
        else:
            add = {}
        objs = s3.list_objects_v2(Bucket=bucketname2, Prefix=itemname, **add)
        for i, obj_ in enumerate(objs['Contents']):
            body = s3.get_object(Bucket=bucketname2, Key=obj_['Key'])['Body'].read()
            #body = obj.get()['Body'].read()
            import exifread
            tags = exifread.process_file(io.BytesIO(body))
            image = obj_['Key'].split("/")[-1].split("thumbnail")[0]
            thumbnail_image = obj_['Key'].split("/")[-1]
            if image in whale_image_to_id:
                additional = {'pictureWhaleId': whale_image_to_id[image] if image in whale_image_to_id else ''}
            else:
                additional = {}
            table.put_item(
                Item={
                    'id': image,
                    'thumbnail': thumbnail_image,
                    'high_res': image,
                    'filename': image,
                    'geocoords': str(tags.gps_latitude if 'gps_latitude' in tags else '') + ',' + str(tags.gps_longitude if 'gps_longitude' in tags else ''),
                    'date_taken': tags.LastModified if 'LastModified' in tags else '',
                    'uploaded_by': context.identity.cognito_identity_id if context else '',
                    'createdAt': '2020-06-03T16:49:42.406Z',
                    'uploadedAt': '2020-06-03T16:49:42.406Z',
                    'updatedAt': '2020-06-03T16:49:42.406Z',
                    'is_new': False,
                    **additional,
                })
        if "NextContinuationToken" in objs and objs['NextContinuationToken']:
            nextToken = objs['NextContinuationToken']
        else:
            break

    return {
        'message': 'Hello from your new Amplify Python lambda!'
    }


#handler({"filename": ""}, None)
