import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { MessageData } from './dto/input';
import { MessageRepository } from 'src/db/repositories/message.repository';
import { ConversationRepository } from 'src/db/repositories/conversation.repository';
import { ParticipantRepository } from 'src/db/repositories/participant.repository';
import { Message } from 'src/db/schemas/message.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MessageService {
  constructor(
    private messageRepo: MessageRepository,
    private conversationRepo: ConversationRepository,
    private participantRepo: ParticipantRepository,
  ) {}

  private logger: Logger = new Logger(MessageService.name);

  async send(
    user_id: string,
    conversation_id: string,
    { text }: MessageData,
  ): Promise<Message> {
    try {
      await this.conversationRepo.getByIdOrThrow(conversation_id);
      await this.participantRepo.getWithUserAndConversationOrThrow(
        conversation_id,
        user_id,
      );
      return await this.messageRepo.create({
        sender_id: user_id,
        text: text,
        conversation_id,
      });
    } catch (error) {
      this.logger.error(
        `Error sending message to conversation: ${conversation_id} from user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async update(
    id: string,
    user_id: string,
    { text }: MessageData,
  ): Promise<Message> {
    try {
      const message = await this.messageRepo.getByIdOrThrow(id);
      const conversation = await this.conversationRepo.getByIdOrThrow(
        message.conversation_id,
      );
      await this.participantRepo.getWithUserAndConversationOrThrow(
        conversation.id,
        user_id,
      );
      if (message.sender_id !== user_id)
        throw new UnauthorizedException('Only sender can update message');
      message.updateOne({ text });
      await message.save();
      return message;
    } catch (error) {
      this.logger.error(
        `Error updating message: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async delete(id: string, user_id: string): Promise<Message> {
    try {
      const message = await this.messageRepo.getByIdOrThrow(id);
      const conversation = await this.conversationRepo.getByIdOrThrow(
        message.conversation_id,
      );
      const participant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          conversation.id,
          user_id,
        );
      if (!participant.is_admin || message.sender_id !== user_id)
        throw new UnauthorizedException(
          'Only sender or admin can delete messages',
        );
      message.deleteOne();
      return message;
    } catch (error) {
      this.logger.error(
        `Error deleting message: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async reply(
    id: string,
    user_id: string,
    { text }: MessageData,
  ): Promise<Message> {
    try {
      const message = await this.messageRepo.getByIdOrThrow(id);
      const conversation = await this.conversationRepo.getByIdOrThrow(
        message.conversation_id,
      );
      await this.participantRepo.getWithUserAndConversationOrThrow(
        conversation.id,
        user_id,
      );
      return this.messageRepo.create({
        conversation_id: conversation.id,
        sender_id: user_id,
        reply_id: id,
        text,
      });
    } catch (error) {
      this.logger.error(
        `Error replying message: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
