import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationRepository } from 'src/db/repositories/conversation.repository';
import { ParticipantRepository } from 'src/db/repositories/participant.repository';
import { CreateGroupData, UpdateGroupData } from './dto';
import { Conversation, Participant } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class GroupService {
  constructor(
    private cache: CacheService,
    private participantRepo: ParticipantRepository,
    private conversationRepo: ConversationRepository,
  ) {}

  private logger: Logger = new Logger(GroupService.name);

  async create(uid: string, data: CreateGroupData): Promise<Conversation> {
    try {
      return await this.conversationRepo.createGroup(uid, data.name);
    } catch (error) {
      this.logger.error(
        `Error creating group for user: ${uid} with name: ${data.name}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async delete(id: string, user_id: string): Promise<{ success: boolean }> {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');
      const participant = await this.participantRepo.getWithUserAndConversation(
        id,
        user_id,
      );
      if (!participant) throw new UnauthorizedException('User not in group');
      if (conversation.creator_id !== user_id)
        throw new UnauthorizedException('Only Owners can delete groups');
      await this.conversationRepo.delete(id);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error deleting group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async update(id: string, user_id: string, data: UpdateGroupData) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');
      const participant = await this.participantRepo.getWithUserAndConversation(
        id,
        user_id,
      );
      if (!participant) throw new UnauthorizedException('User not in group');
      if (!participant.is_admin)
        throw new UnauthorizedException('Only Admins can edit Group Info');
      await this.conversationRepo.update(id, data);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error updating group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
  // changePrivacy(){}
  // generateInviteLink() {}
  // acceptInviteRequest() {}
  // rejectInviteRequest() {}
  // joinWithLink() {}

  async makeOwner(id: string, user_id: string, participant_id: string) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      await this.participantRepo.getWithUserAndConversationOrThrow(id, user_id);

      if (conversation.creator_id !== user_id)
        throw new UnauthorizedException('Only Owners can change Ownership');

      const participant =
        await this.participantRepo.getByIdOrThrow(participant_id);

      await this.conversationRepo.updateOwnership(id, participant.user_id);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error changing owner of group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async addMembers(id: string, user_id: string, users: string[]) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      const participant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          id,
          user_id,
        );
      if (!participant.is_admin)
        throw new UnauthorizedException('Only admins can add users');
      await this.participantRepo.createMany(id, users);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error adding members to group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getParticipants(id: string, user_id: string): Promise<Participant[]> {
    const cacheKey = `${id} participants by user: ${user_id}`;
    try {
      const cached = await this.cache.get<Participant[]>(cacheKey);
      if (cached) return cached;
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');
      await this.participantRepo.getWithUserAndConversationOrThrow(id, user_id);
      const participants = await this.participantRepo.list(id);
      await this.cache.set<Participant[]>(
        cacheKey,
        participants,
        60 * 60 * 24 * 7,
      );
      return participants;
    } catch (error) {
      this.logger.error(
        `Error adding members to group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async makeAdmin(id: string, user_id: string, participant_id: string) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      const requestingParticipant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          id,
          user_id,
        );
      if (!requestingParticipant.is_admin)
        throw new UnauthorizedException('Only admins can edit admins');
      const participant =
        await this.participantRepo.getByIdOrThrow(participant_id);

      if (participant.is_admin)
        throw new BadRequestException('Participant already an admin');
      // Sort out the vulnerability of updating another group admin from one group by checking if participant in group or changing getting participant to with conversation
      await this.participantRepo.editAdminStatus(id, true);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error making participant: ${id} an admin by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async removeAdmin(id: string, user_id: string, participant_id: string) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      const requestingParticipant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          id,
          user_id,
        );
      if (!requestingParticipant.is_admin)
        throw new UnauthorizedException('Only admins can edit admins');

      const participant =
        await this.participantRepo.getByIdOrThrow(participant_id);

      if (participant.user_id === conversation.creator_id)
        throw new UnauthorizedException('Owners cannot be removed from admin');

      if (!participant.is_admin)
        throw new BadRequestException('Participant is not an admin');
      // Sort out the vulnerability of updating another group admin from one group by checking if participant in group or changing getting participant to with conversation
      await this.participantRepo.editAdminStatus(id, false);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error removing participant: ${id} as admin by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async removeMember(id: string, user_id: string, participant_id: string) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      const requestingParticipant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          id,
          user_id,
        );
      if (!requestingParticipant.is_admin)
        throw new UnauthorizedException('Only admins can remove users');

      const participant =
        await this.participantRepo.getByIdOrThrow(participant_id);

      if (participant.user_id === conversation.creator_id)
        throw new UnauthorizedException('Owners cannot be removed from group');

      // Sort out the vulnerability of updating another group admin from one group by checking if participant in group or changing getting participant to with conversation
      await this.participantRepo.delete(participant_id);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error removing participant: ${id} from group by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async leave(id: string, user_id: string) {
    try {
      const conversation = await this.conversationRepo.getByIdOrThrow(id);
      if (!conversation.group)
        throw new BadRequestException('Conversation not a group');

      const participant =
        await this.participantRepo.getWithUserAndConversationOrThrow(
          id,
          user_id,
        );

      await this.participantRepo.delete(participant.id);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error leaving group: ${id} by user: ${user_id}`,
        error,
      );
      throw new RpcException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
