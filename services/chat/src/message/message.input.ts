import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
class CreateMessageInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Text Content' })
  text: string;
}

@InputType()
class UpdateMessageInput extends PartialType(CreateMessageInput) {}

export { CreateMessageInput, UpdateMessageInput };
