import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { ConversationRepository } from 'src/db/repositories/conversation.repository';
import { RpcException } from '@nestjs/microservices';
import { MessageRepository } from 'src/db/repositories/message.repository';
import { FriendRepository } from 'src/db/repositories/friend.repository';
import { CacheService } from 'src/cache/cache.service';
import { ParticipantRepository } from 'src/db/repositories/participant.repository';
import { MessageDocument } from 'src/db/schemas/message.schema';

@Injectable()
export class ConversationService {
  constructor(
    private cache: CacheService,
    private conversationRepo: ConversationRepository,
    private messageRepo: MessageRepository,
    private friendshipRepo: FriendRepository,
    private participantRepo: ParticipantRepository,
  ) {}

  private logger: Logger = new Logger(ConversationService.name);

  async startNewConversation(uid: string, rid: string): Promise<Conversation> {
    try {
      const friendship = await this.friendshipRepo.get(uid, rid);
      if (!friendship) throw new BadRequestException('Users not friends');
      const exists = await this.conversationRepo.getUserPrivateConversation(
        uid,
        rid,
      );
      if (exists)
        throw new BadRequestException(
          'User already have a conversation with this user',
        );
      return this.conversationRepo.create(uid, rid);
    } catch (error) {
      this.logger.error(
        `Error starting conversation with recipient: ${rid} for user: ${uid}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getUserConversations(id: string): Promise<Conversation[]> {
    const cacheKey = `conversations:${id}`;
    try {
      const cached = await this.cache.get<Conversation[]>(cacheKey);
      if (cached) return cached;
      const conversations =
        await this.conversationRepo.getUserConversations(id);
      await this.cache.set<Conversation[]>(
        cacheKey,
        conversations,
        60 * 60 * 24 * 7,
      );
      return conversations;
    } catch (error) {
      this.logger.error(`Error fetching conversations for user: ${id}`, error);
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getConversation(user_id: string, id: string): Promise<Conversation> {
    const cacheKey = `conversation:${user_id}:${id}`;
    try {
      const cached = await this.cache.get<Conversation>(cacheKey);
      if (cached) return cached;

      await this.participantRepo.getWithUserAndConversationOrThrow(id, user_id);

      const conversation = await this.conversationRepo.get(id);
      if (!conversation) throw new NotFoundException('Conversation not found');

      await this.cache.set<Conversation>(
        cacheKey,
        conversation,
        60 * 60 * 24 * 7,
      );
      return conversation;
    } catch (error) {
      this.logger.error(
        `Error fetching conversation: ${id} for user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getConversationMessages(user_id: string, id: string) {
    const cacheKey = `conversation_messages:${user_id}:${id}`;

    try {
      const cached = await this.cache.get<MessageDocument[]>(cacheKey);
      if (cached) return cached;
      await this.conversationRepo.getByIdOrThrow(id);
      await this.participantRepo.getWithUserAndConversationOrThrow(id, user_id);
      const messages = await this.messageRepo.listByConversation(id);
      await this.cache.set<MessageDocument[]>(cacheKey, messages, 60);
      return messages;
    } catch (error) {
      this.logger.error(
        `Error fetching conversation messages: ${id} for user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
