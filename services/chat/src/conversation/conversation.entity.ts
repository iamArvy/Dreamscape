import { ObjectType, Field } from '@nestjs/graphql';
import { Conversation as Conversations } from './conversation.schema';
@ObjectType()
export class Conversation implements Conversations {
  @Field(() => String, { description: 'Name of conversation' })
  name: string;

  @Field(() => Boolean, { description: 'Is Conversation a group' })
  group?: boolean;

  @Field(() => String, { description: 'ID for the message being replied to' })
  creator?: string;
}
