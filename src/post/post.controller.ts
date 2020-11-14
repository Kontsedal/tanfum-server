import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';

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
}
