import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class AddParticipantsInput {
  @IsArray()
  @IsNotEmpty()
  @Field(() => [String], { description: 'users' })
  users: string[];
}

@ArgsType()
export class AddUsersToGroupArgs {
  @Field(() => String)
  cid: string;

  @Field(() => [String])
  users: string[];
}
