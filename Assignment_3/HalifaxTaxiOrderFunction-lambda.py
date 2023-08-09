import boto3
import json
import random

CAR_TYPES = ["Compact", "Mid-size Sedan", "SUV", "Luxury"]
ADDONS = ["GPS", "Camera"]
CLIENT_ADDRESSES = ["431 University Avenue", "123 windsor Street", "789 quinpool road"]

sns = boto3.client('sns')
topic_arn = 'arn:aws:sns:us-east-1:283622577067:HalifaxTaxiTopic'  

def lambda_handler(event, context):
    car_type = random.choice(CAR_TYPES)
    addons = random.sample(ADDONS, random.randint(0, len(ADDONS)))
    address = random.choice(CLIENT_ADDRESSES)

    # Send car_type message
    sns.publish(
        TopicArn=topic_arn,
        Message=json.dumps({"car_type": car_type}),
        MessageAttributes={
            'car_type': {
                'DataType': 'String',
                'StringValue': 'CarType'
            }
        }
    )

    # Send accessories message
    sns.publish(
        TopicArn=topic_arn,
        Message=json.dumps({"addons": addons}),
        MessageAttributes={
            'addons': {
                'DataType': 'String',
                'StringValue': 'Accessories'
            }
        }
    )

    # Send address message
    sns.publish(
        TopicArn=topic_arn,
        Message=json.dumps({"address": address}),
        MessageAttributes={
            'address': {
                'DataType': 'String',
                'StringValue': 'Address'
            }
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Order messages sent to the SNS topic.')
    }

