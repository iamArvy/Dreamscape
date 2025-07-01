import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post as Posts } from './app.schema';
@ObjectType()
export class Post implements Posts {
  @Field(() => String, { description: 'Author ID' })
  author_id: string;

  @Field(() => String, { description: 'Author ID' })
  author_username: string;

  @Field(() => String, { description: 'Author ID' })
  author_avatar: string;

  @Field(() => String, { description: 'Content of the Post' })
  content: string;

  @Field(() => [String], { description: 'Media urls for the Post' })
  media: string[];

  @Field(() => String, { description: 'Parent ID for the post if any' })
  parent_id: string;

  @Field(() => Int, { description: 'Number of Likes on Post' })
  like_count: number;

  @Field(() => Int, { description: 'Number of Child content' })
  child_count: number;

  @Field(() => Int, { description: 'Number of Child content' })
  views_count: number;
}
