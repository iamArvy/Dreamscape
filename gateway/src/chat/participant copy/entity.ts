import { ObjectType, Field } from '@nestjs/graphql';
import { Participant as Participants } from '@prisma/client';
@ObjectType()
export class Participant implements Participants {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'ID for the User' })
  user_id: string;

  @Field(() => Boolean, { description: 'Is Participant an Admin' })
  is_admin: boolean;

  @Field(() => String, {
    description: 'ID for the conversation this participant belongs to',
  })
  conversation_id: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
