import { Body, Controller } from '@nestjs/common';
import {
  GetConversationInput,
  GetConversationsInput,
  StartConversationInput,
} from './dto/conversation.input';
import { ConversationService } from './conversation.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @GrpcMethod('ConversationService')
  health() {
    return { success: true };
  }

  @GrpcMethod('ConversationService')
  create({ user_id, recipient_id }: StartConversationInput) {
    return this.service.startNewConversation(user_id, recipient_id);
  }

  @GrpcMethod('ConversationService')
  async list({ user_id }: GetConversationsInput) {
    return await this.service.getUserConversations(user_id);
  }

  @GrpcMethod('ConversationService')
  async get({ user_id, id }: GetConversationInput) {
    return await this.service.getConversation(user_id, id);
  }

  @GrpcMethod('ConversationService')
  async messages({ user_id, id }: GetConversationInput) {
    return await this.service.getConversationMessages(user_id, id);
  }
}
