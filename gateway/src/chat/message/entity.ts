import { ObjectType, Field } from '@nestjs/graphql';
import { Message as Messages } from './schema';
@ObjectType()
export class MessageEntity implements Messages {
  @Field(() => String, { description: 'Conversation ID' })
  conversation_id: string;

  @Field(() => String, { description: 'ID of the Sender' })
  sender_id: string;

  @Field(() => String, { description: 'ID for the message being replied to' })
  reply_id: string;

  @Field(() => String, { description: 'Text Content for the message' })
  text: string;
}
