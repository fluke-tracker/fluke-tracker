import os
import posixpath
from io import BytesIO

import boto3
from PIL import Image, ImageDraw, ImageFont



def save_image(img, bucket, image_name, folder):
    key = posixpath.join(folder, image_name)
    object = bucket.Object(key)
    file_stream = BytesIO()
    img.save(file_stream, format='jpeg')
    print(key)
    object.put(Body=file_stream.getvalue(), ACL='public-read')
    return key


def get_uploader_from_image(image_str):
    dynamo_db = boto3.resource('dynamodb')
    picture_table_str = os.environ.get('API_WHALEWATCH_PICTURETABLE_NAME')
    print(picture_table_str)
    picture_table = dynamo_db.Table(picture_table_str)
    picture = picture_table.get_item(Key={'id': image_str})
    return picture['Item']['uploaded_by']


def watermark_all_images():
    picture_table_name = os.environ.get('API_WHALEWATCH_PICTURETABLE_NAME')
    print(picture_table_name)
    dynamo_db = boto3.resource('dynamodb')
    picture_table = dynamo_db.Table(picture_table_name)
    response = picture_table.scan()
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = picture_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])

    for item in data:
        try:
            bucket_str = os.environ.get('BUCKET')
            watermark_image('cropped_images/' + item['id'], bucket_str, item['uploaded_by'])
        except:
            print("error")


def watermark_image(image_str, bucket_str, watermark_text):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket_str)
    print(image_str)
    object = bucket.Object(image_str)
    response = object.get()
    file_stream = response['Body']
    image = Image.open(file_stream)
    base = image.convert('RGBA')
    width, height = base.size

    # make a blank image for the text, initialized to transparent text color
    txt = Image.new('RGBA', base.size, (255, 255, 255, 0))

    # get a font
    fnt = ImageFont.truetype(os.path.join(os.path.dirname(__file__), 'arial.ttf'), 40)
    # get a drawing context
    d = ImageDraw.Draw(txt)
    print(watermark_text)
    w, h = d.textsize(watermark_text, font=fnt)

    # draw text, half opacity
    d.text(((width - w) / 2, (height - h) / 2), watermark_text, font=fnt, fill=(255, 255, 255, 128))
    # txt = txt.rotate(5)

    out = Image.alpha_composite(base, txt)
    out = out.convert("RGB")
    save_image(out, bucket, os.path.basename(image_str).replace('thumbnail.jpg', ''), os.environ.get("DESTINATION_FOLDER"))
    return image_str


def handler(event, context):
    print('received event:')
    print(event)
    key = event['Records'][0]["s3"]["object"]["key"]
    bucket_str = event['Records'][0]['s3']['bucket']['name']
    result = watermark_image(key, bucket_str, get_uploader_from_image(os.path.basename(key).replace('thumbnail.jpg', '')))

    return {
        'statusCode': 200,
        'body': os.path.basename(result)
    }


if __name__ == "__main__":
    watermark_all_images()
