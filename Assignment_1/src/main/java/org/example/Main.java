package org.example;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import java.io.File;
import java.util.List;
public class Main {
    public static void main(String[] args) {

        AWSCredentials cred = new BasicAWSCredentials(
                "AKIAR5G66XY7EBH2NC5S",
                "URXTwY2ogB7Wkrr6SfGjAURU4vAm4sxdHmxbktx1"
        );

        AmazonS3 s3cli = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(cred))
                .withRegion(Regions.US_EAST_1)
                .build();

        String bucketName = "sdp-fenil-test";

        if(s3cli.doesBucketExist(bucketName)) {
            System.out.println("The Bucket is already created.." + " Try with a different Bucket name...");
            return;
        }
        s3cli.createBucket(bucketName);
        List<Bucket> buckets = s3cli.listBuckets();
        for(Bucket bucket : buckets) {
            System.out.println(bucket.getName() + "Bucket created");
        }
        s3cli.putObject(
                bucketName,
                "index.html",
                new File("C:/Users/fenil/OneDrive/Desktop/Serverless/Assignment 1/awsS3/index.html")
        );
    }
}