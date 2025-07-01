import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
// import { Participant } from '@prisma/client';

@Injectable()
export class ParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(conversation_id: string) {
    return this.prisma.participant.findMany({
      where: {
        conversation_id,
      },
    });
  }

  getById(id: string) {
    return this.prisma.participant.findUnique({
      where: {
        id,
      },
    });
  }

  getByIdOrThrow(id: string) {
    return this.prisma.participant.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  getWithUserAndConversation(conversation_id: string, user_id: string) {
    return this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id,
          conversation_id,
        },
      },
    });
  }

  getWithUserAndConversationOrThrow(conversation_id: string, user_id: string) {
    return this.prisma.participant.findUniqueOrThrow({
      where: {
        user_id_conversation_id: {
          user_id,
          conversation_id,
        },
      },
    });
  }

  create(user_id: string, conversation_id: string) {
    return this.prisma.participant.create({
      data: { user_id, conversation_id },
    });
  }

  createMany(conversation_id: string, users: string[]) {
    return this.prisma.participant.createMany({
      data: users.map((user_id) => ({
        user_id,
        conversation_id,
      })),
    });
  }

  editAdminStatus(id: string, status: boolean) {
    return this.prisma.participant.update({
      where: { id },
      data: {
        is_admin: status,
      },
    });
  }

  delete(id: string) {
    return this.prisma.participant.delete({
      where: {
        id,
      },
    });
  }
}
