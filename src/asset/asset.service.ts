import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { uuid } from 'uuidv4';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get('S3_KEY'),
      secretAccessKey: configService.get('S3_SECRET'),
      endpoint: configService.get('S3_HOST'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async upload(file, bucketName) {
    await this.ensureBucketExistence(bucketName);
    const fileName = uuid() + path.extname(file.originalname);
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
    };
    await this.s3.putObject(params).promise();
    return `${this.configService.get('S3_HOST')}/${bucketName}/${fileName}`;
  }

  async ensureBucketExistence(bucketName: string) {
    try {
      await this.s3.headBucket({ Bucket: bucketName }).promise();
    } catch (error) {
      await this.s3.createBucket({ Bucket: bucketName }).promise();
      await this.s3
        .putBucketPolicy({
          Bucket: bucketName,
          Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject', 's3:GetObjectVersion'],
                Resource: [`arn:aws:s3:::${bucketName}/*`],
              },
            ],
          }),
        })
        .promise();
    }
  }
}
