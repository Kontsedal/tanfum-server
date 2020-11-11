import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostContentBlockEntity } from './postContentBlock.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => PostContentBlockEntity, (content) => content.post)
  contentBlocks: PostContentBlockEntity[];
}
