import { ApiProperty } from '@nestjs/swagger';
import { Post } from './app.schema';

export class PostResponse implements Post {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  author_id: string;

  @ApiProperty()
  author_username: string;

  @ApiProperty()
  author_avatar: string;

  @ApiProperty()
  parent_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [String] })
  media: string[];

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  child_count: number;

  @ApiProperty()
  views_count: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
