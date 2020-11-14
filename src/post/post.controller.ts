import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import * as path from 'path';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get(':postId')
  getPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPost(postId);
  }

  @Patch(':postId')
  updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, updatePostDto);
  }
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    const bucketName = 'testbucket3';
    const s3 = new AWS.S3({
      accessKeyId: 'minio',
      secretAccessKey: 'minio123',
      endpoint: 'http://localhost:9000',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    try {
      await s3.headBucket({ Bucket: bucketName }).promise();
    } catch (error) {
      await s3.createBucket({ Bucket: bucketName }).promise();
      await s3
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
    const fileName = uuid() + path.extname(file.originalname);
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
    };
    await s3.putObject(params).promise();
    return `http://localhost:9000/${bucketName}/${fileName}`;
  }
}
