import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

export enum PostContentBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class PostContentBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: PostContentBlockType;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.contentBlocks)
  post: Post;
}
