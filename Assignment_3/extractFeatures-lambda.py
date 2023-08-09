import json
import boto3
import re

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        file_name = event['Records'][0]['s3']['object']['key']
        
        # Read the file content
        file_content = get_file_content(bucket_name, file_name)
        
        # Perform Named Entity Recognition (NER)
        named_entities = perform_ner(file_content)
        
        # Create the JSON object
        json_result = create_json_object(named_entities, file_name.split('.')[0])
        
        # Save the JSON object to the new bucket
        save_json_object_to_bucket('tagsb00917151', file_name + '.json', json_result)
        
        return {
            'statusCode': 200,
            'body': 'Named entity extraction and saving to new bucket completed successfully.'
        }
    except Exception as e:
        print('Error:', e)
        return {
            'statusCode': 500,
            'body': 'Error processing the file and saving to the new bucket.'
        }

def get_file_content(bucket, key):
    response = s3_client.get_object(Bucket=bucket, Key=key)
    file_content = response['Body'].read().decode('utf-8')
    return file_content

def perform_ner(file_content):
    named_entity_pattern = r'(\b[A-Z][a-zA-Z]+\b)'
    matches = re.findall(named_entity_pattern, file_content)
    named_entities = {}
    
    if matches:
        for entity in matches:
            named_entities[entity] = named_entities.get(entity, 0) + 1
    
    return named_entities

def create_json_object(named_entities, file_key):
    json_result = {file_key + 'ne': named_entities}
    return json_result

def save_json_object_to_bucket(bucket, key, json_data):
    s3_client.put_object(Bucket=bucket, Key=key, Body=json.dumps(json_data))
