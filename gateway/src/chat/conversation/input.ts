import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateGroupInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Text Content' })
  name: string;
}
