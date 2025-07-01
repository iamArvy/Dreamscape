import { IsNotEmpty, IsString } from 'class-validator';

export class MessageData {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class MessageUserInput {
  id: string;
  user_id: string;
}

export class CreateMessageInput {
  user_id: string;
  conversation_id: string;
  data: MessageData;
}

export class ReplyMessageInput extends MessageUserInput {
  data: MessageData;
}

export class UpdateMessageInput extends MessageUserInput {
  data: MessageData;
}
