import json
import boto3

s3_client = boto3.client('s3')
dynamodb_client = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            file_name = record['s3']['object']['key']
            
            # Read the JSON file content
            file_content = get_file_content(bucket_name, file_name)
            json_result = json.loads(file_content)
            
            entities_key = file_name[:3] + "ne"
            entities = json_result.get(entities_key, {})
            
            # Update the DynamoDB table with the entities from the current file
            update_dynamodb(entities)
        
        return {
            'statusCode': 200,
            'body': 'DynamoDB table updated successfully.'
        }
    except Exception as e:
        print('Error:', e)
        return {
            'statusCode': 500,
            'body': 'Error updating the DynamoDB table.'
        }

def get_file_content(bucket, key):
    response = s3_client.get_object(Bucket=bucket, Key=key)
    file_content = response['Body'].read().decode('utf-8')
    return file_content

def update_dynamodb(entities):
    table_name = 'entityFrequencyDb'  # Replace with your actual DynamoDB table name

    # Iterate through the entities object and update the DynamoDB table
    for entity_name, entity_count in entities.items():
        params = {
            'TableName': table_name,
            'Item': {
                'entity': {'S': entity_name},
                'count': {'N': str(entity_count)}
            }
        }

        dynamodb_client.put_item(**params)

    print('DynamoDB table updated.')
