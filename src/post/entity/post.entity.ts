import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostContentBlock } from './postContentBlock';
import { Tag } from './tag';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @JoinTable()
  @OneToMany(() => PostContentBlock, (content) => content.post, {
    cascade: true,
  })
  contentBlocks: PostContentBlock[];

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: number;
}
