import { ObjectType, Field } from '@nestjs/graphql';
import { Participant as Participants } from './participant.schema';
@ObjectType()
export class Participant implements Participants {
  @Field(() => String, { description: 'ID for the User' })
  user_id: string;

  @Field(() => Boolean, { description: 'Is Participant an Admin' })
  isAdmin: boolean;

  @Field(() => String, {
    description: 'ID for the conversation this participant belongs to',
  })
  conversation_id: string;
}
