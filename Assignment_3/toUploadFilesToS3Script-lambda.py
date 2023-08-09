# Import required libraries
import boto3
import os
import time


bucket_name = "sampledatab00917151"
s3 = boto3.resource('s3')

# Create the S3 bucket
s3.create_bucket(Bucket=bucket_name)

# Upload files to the bucket with a delay of 100 milliseconds
file_dir = r"C:\Users\fenil\OneDrive\Desktop\Serverless\Assignment 3\pART 2\pythonscript\tech\tech"
files = os.listdir(file_dir)
for file in files:
    file_path = os.path.join(file_dir, file)
    s3.Object(bucket_name, file).upload_file(file_path)
    time.sleep(0.1)
