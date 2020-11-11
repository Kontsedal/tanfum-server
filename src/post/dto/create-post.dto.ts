import { PostContentBlockType } from '../entity/postContentBlock.entity';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @Type(() => PostContent)
  contentBlocks: Array<PostContent>;

  @IsString({ each: true })
  @Length(2, 20)
  tags: string[];
}

class PostContent {
  @IsEnum(PostContentBlockType)
  type: PostContentBlockType;

  @IsString()
  @IsDefined()
  content: string;
}
