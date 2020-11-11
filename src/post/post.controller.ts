import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('api/post')
export class PostController {
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return createPostDto;
  }
}
