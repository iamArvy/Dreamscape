import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Conversation, Prisma } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
    });
  }

  getByIdOrThrow(id: string) {
    return this.prisma.conversation.findUniqueOrThrow({
      where: { id },
    });
  }

  create(user: string, recipient: string) {
    return this.prisma.conversation.create({
      data: {
        participant: {
          createMany: { data: [{ user_id: user }, { user_id: recipient }] },
        },
      },
    });
  }

  createGroup(uid: string, name: string): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        participant: {
          create: { user_id: uid, is_admin: true },
        },
        group: true,
        creator: { connect: { user_id: uid } },
        name,
      },
    });
  }

  getUserConversations(uid: string): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: {
        participant: {
          some: {
            user_id: uid,
          },
        },
      },
    });
  }

  getUserPrivateConversations(user_id: string) {
    return this.prisma.conversation.findMany({
      where: {
        participant: {
          some: {
            user_id,
          },
        },
        group: false,
      },
    });
  }

  getUserPrivateConversation(user_id: string, recipient_id: string) {
    return this.prisma.conversation.findFirst({
      where: {
        participant: {
          some: {
            user_id: { in: [user_id, recipient_id] },
          },
        },
        group: false,
      },
    });
  }

  getUserGroups(user_id: string) {
    return this.prisma.conversation.findMany({
      where: {
        participant: {
          some: {
            user_id,
          },
        },
        group: true,
      },
    });
  }

  update(id: string, data: Prisma.ConversationUpdateInput) {
    return this.prisma.conversation.update({
      where: {
        id,
      },
      data,
    });
  }
  updateOwnership(id: string, user_id: string) {
    return this.prisma.conversation.update({
      where: {
        id,
      },
      data: {
        creator: {
          connect: { user_id },
        },
      },
    });
  }

  delete(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}
