import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/service';
import { Conversation } from '@prisma/client';
import { CreateGroupInput } from './input';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async startNewConversation(uid: string, rid: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.create({
      data: {
        participant: {
          createMany: { data: [{ user_id: uid }, { user_id: rid }] },
        },
      },
    });

    return conversation;
  }

  async createGroup(
    uid: string,
    data: CreateGroupInput,
  ): Promise<Conversation> {
    return await this.prisma.conversation.create({
      data: {
        participant: {
          create: { user_id: uid, is_admin: true },
        },
        group: true,
        creator: { connect: { user_id: uid } },
        name: data.name,
      },
    });
  }

  async getUserConversations(uid: string): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      where: {
        participant: {
          some: {
            user_id: uid,
          },
        },
      },
    });
  }

  async getConversation(cid: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: cid },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async changeOwnership(
    uid: string,
    cid: string,
    pid: string,
    is_owner: boolean,
  ) {
    if (!is_owner)
      throw new UnauthorizedException('Only Owners can change Ownership');

    return await this.prisma.conversation.update({
      where: {
        id: cid,
        creator_id: uid,
      },
      data: {
        creator: {
          connect: { user_id: pid },
        },
      },
    });
  }

  async deleteGroup(
    cid: string,
    is_owner: boolean,
    is_group: boolean,
  ): Promise<Conversation> {
    if (!is_group) throw new BadRequestException('Conversation not a group');
    if (!is_owner)
      throw new UnauthorizedException('Only Owners can delete groups');
    return await this.prisma.conversation.delete({
      where: { id: cid },
    });
  }
}
