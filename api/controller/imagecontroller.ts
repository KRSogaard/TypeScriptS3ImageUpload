import { APILogger } from '../logger/api.logger';
import * as AWS from 'aws-sdk';
require('dotenv').config()

export class ImageController {

    private logger: APILogger;
    private s3: any;
    private bucketName: string;

    constructor() {


        console.log("AWS Config", {
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: 'us-east-1'
        });
        // Configure the AWS SDK
        AWS.config.update({
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: 'us-east-1'
        });

        this.logger = new APILogger();
        this.s3 = new AWS.S3();
        this.logger.info("Got S3 " + this.s3, []);
        this.bucketName = process.env.bucket;

    }

    async uploadImage(name: string, imageBody: any) {
        this.logger.info("Got request to upload iamge to " + name, [this.bucketName]);

        await this.s3.upload({
            Bucket: this.bucketName,
            Key: name,
            Body: imageBody
        }).promise();
    }
}
