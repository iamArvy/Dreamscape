import { ObjectType, Field } from '@nestjs/graphql';
import { User as Users } from '@prisma/client';
@ObjectType()
export class User implements Users {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'ID for the User' })
  user_id: string;

  @Field(() => String, {
    description: 'ID for the conversation this participant belongs to',
  })
  username: string;

  @Field(() => String, {
    description: 'ID for the conversation this participant belongs to',
  })
  avatar: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
