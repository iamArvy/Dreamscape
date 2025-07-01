import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateMessageInput,
  MessageUserInput,
  ReplyMessageInput,
  UpdateMessageInput,
} from './dto/input';

@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @GrpcMethod('MessageService')
  health() {
    return { success: true };
  }
  @GrpcMethod('MessageService')
  send({ user_id, conversation_id, data }: CreateMessageInput) {
    return this.service.send(user_id, conversation_id, data);
  }

  @GrpcMethod('MessageService')
  update({ id, user_id, data }: UpdateMessageInput) {
    return this.service.update(id, user_id, data);
  }

  @GrpcMethod('MessageService')
  delete({ id, user_id }: MessageUserInput) {
    return this.service.delete(id, user_id);
  }

  @GrpcMethod('MessageService')
  reply({ id, user_id, data }: ReplyMessageInput) {
    return this.service.reply(id, user_id, data);
  }
}
