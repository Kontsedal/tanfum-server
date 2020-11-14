import { PostContentBlockType } from '../entity/postContentBlock';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsString,
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
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  tags: string[];
}

class PostContent {
  @IsEnum(PostContentBlockType)
  type: PostContentBlockType;

  @IsString()
  @IsDefined()
  content: string;
}
