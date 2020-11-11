import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostContentBlock } from './entity/postContentBlock';
import { Tag } from './entity/tag';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostContentBlock, Tag])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
