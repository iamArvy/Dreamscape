import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Prisma, Participant } from '../../generated/prisma';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}
  // private model = this.prisma.participant;

  async create(data: Prisma.ParticipantCreateInput) {
    return await this.prisma.participant.create({
      data,
    });
  }

  participants(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ParticipantWhereUniqueInput;
    where?: Prisma.ParticipantWhereInput;
    orderBy?: Prisma.ParticipantOrderByWithRelationInput;
    select?: Prisma.ParticipantSelect;
  }): Promise<Participant[] | []> {
    return this.prisma.participant.findMany(params);
  }

  participant(params: {
    where: Prisma.ParticipantWhereUniqueInput;
    select?: Prisma.ParticipantSelect;
  }): Promise<Participant | null> {
    try {
      return this.prisma.participant.findUnique(params);
    } catch (error) {
      throw new Error(error as string);
      // handlePrismaError(error, modelName);
    }
  }

  getParticipantWithUserAndConversation(
    uid: string,
    cid: string,
  ): Promise<Participant | null> {
    return this.prisma.participant.findUniqueOrThrow({
      where: {
        user_id_conversationId: {
          user_id: uid,
          conversationId: cid,
        },
      },
    });
  }

  update(params: {
    where: Prisma.ParticipantWhereUniqueInput;
    data: Prisma.ParticipantUpdateInput;
  }) {
    return this.prisma.participant.update(params);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} participant`;
  // }
  async delete(
    where: Prisma.ParticipantWhereUniqueInput,
  ): Promise<Participant> {
    return this.prisma.participant.delete({
      where,
    });
  }

  async isAdmin(uid: string, cid: string): Promise<boolean> {
    const user = await this.getParticipantWithUserAndConversation(uid, cid);
    if (user?.isAdmin) return true;
    return false;
  }
}
