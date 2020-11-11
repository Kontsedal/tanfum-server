import { Injectable } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Tag } from './entity/tag';
import { PostContentBlock } from './entity/postContentBlock';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(PostContentBlock)
    private readonly postContentBlockRepository: Repository<PostContentBlock>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const tags: Tag[] = await Promise.all<Tag>(
      createPostDto.tags.map(this.preloadTagByName.bind(this)),
    );
    const contentBlocks: PostContentBlock[] = await Promise.all(
      createPostDto.contentBlocks.map((block) =>
        this.postContentBlockRepository.create(block),
      ),
    );
    const post = this.postRepository.create({
      ...createPostDto,
      tags,
      contentBlocks,
    });
    return this.postRepository.save(post);
  }

  getPost(postId) {
    return this.postRepository.findOne(postId, {
      relations: ['tags', 'contentBlocks'],
    });
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const existingTag = await this.tagRepository.findOne({ name });
    if (existingTag) {
      return existingTag;
    }
    return this.tagRepository.create({ name });
  }
}
