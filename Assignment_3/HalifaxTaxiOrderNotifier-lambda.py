import boto3
import json
sns = boto3.client('sns')
sns_topic_arn = 'arn:aws:sns:us-east-1:283622577067:HalifaxTopicEmailNotification' 
your_email_address = 'fenilpatel61@gmail.com'  

def lambda_handler(event, context):
    # Process messages from the CartypeQueue
    cartype_queue_url = 'https://sqs.us-east-1.amazonaws.com/283622577067/CartypeQueue'  
    cartype_messages = process_queue(cartype_queue_url)
 
    # Process messages from the AccessoriesQueue
    accessories_queue_url = 'https://sqs.us-east-1.amazonaws.com/283622577067/AccessoriesQueue' 
    accessories_messages = process_queue(accessories_queue_url)
    
    # Process messages from the AddressQueue
    address_queue_url = 'https://sqs.us-east-1.amazonaws.com/283622577067/AddressQueue'
    address_messages = process_queue(address_queue_url)

    if cartype_messages or accessories_messages or address_messages:
        message_body = {
            "car_type": cartype_messages[0]["car_type"],
            "addons": accessories_messages[0]["addons"],
            "address": address_messages[0]["address"]
        }
        sns.publish(
            TopicArn=sns_topic_arn,
            Message=json.dumps(message_body),
            Subject="New Car Delivery Order",
            MessageAttributes={
                'MessageType': {
                    'DataType': 'String',
                    'StringValue': 'OrderDetails'
                }}}
    return {
        'statusCode': 200,
        'body': json.dumps('SQS message processing completed.')
    }
def process_queue(queue_url):
    sqs = boto3.client('sqs')
    messages = []
    response = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        MessageAttributeNames=['All'],
        VisibilityTimeout=30,
        WaitTimeSeconds=0
    )
    if 'Messages' in response:
        for message in response['Messages']:
            message_body = json.loads(message['Body'])
            messages.append(message_body)
            # Delete the message from the queue
            sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=message['ReceiptHandle'])
    
    return messages
