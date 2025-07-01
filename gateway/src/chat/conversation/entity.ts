import { ObjectType, Field } from '@nestjs/graphql';
import { Conversation as Conversations } from '@prisma/client';
@ObjectType()
export class Conversation implements Conversations {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'Name of conversation' })
  name: string;

  @Field(() => Boolean, { description: 'Is Conversation a group' })
  group: boolean;

  @Field(() => String, { description: 'ID for the message being replied to' })
  creator_id: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
