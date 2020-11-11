import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

export enum PostContentBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class PostContentBlockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: PostContentBlockType;

  @Column()
  content: string;

  @ManyToOne(() => PostEntity, (post) => post.contentBlocks)
  post: PostEntity;
}
