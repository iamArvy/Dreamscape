import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';
import { Participant } from '@prisma/client';

@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversationParticipant(
    uid: string,
    cid: string,
  ): Promise<Participant> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        user_id_conversation_id: {
          user_id: uid,
          conversation_id: cid,
        },
      },
    });
    if (!participant)
      throw new NotFoundException('Participant not found in Conversation');
    return participant;
  }

  async addUsersToGroup(
    users: string[],
    cid: string,
    is_admin: boolean,
    is_group: boolean,
  ): Promise<boolean> {
    if (!is_group) throw new BadRequestException('Conversation not a Group');
    if (!is_admin) throw new UnauthorizedException('User not Admin');
    await this.prisma.participant.createMany({
      data: users.map((user_id) => ({
        user_id,
        conversation_id: cid,
      })),
    });
    return true;
  }

  async getConversationParticipants(cid: string): Promise<Participant[] | []> {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: cid,
      },
    });
  }

  async makeAdmin(
    pid: string,
    user_is_admin: boolean,
    member_is_admin: boolean,
  ) {
    if (!user_is_admin)
      throw new UnauthorizedException('Only Admins can add admin status');
    if (member_is_admin)
      throw new BadRequestException('Participant is already an admin');
    return await this.prisma.participant.update({
      where: { id: pid },
      data: {
        is_admin: true,
      },
    });
  }

  async removeAdmin(
    pid: string,
    user_is_admin: boolean,
    member_is_admin: boolean,
    is_owner: boolean,
  ) {
    if (!user_is_admin)
      throw new UnauthorizedException('Only Admins can remove admin status');
    if (is_owner)
      throw new UnauthorizedException('Owners can not be removed from admin');
    if (!member_is_admin)
      throw new BadRequestException('Participant is not an admin');
    return await this.prisma.participant.update({
      where: { id: pid },
      data: {
        is_admin: false,
      },
    });
  }

  async removeUserFromGroup(
    cid: string,
    pid: string,
    is_admin: boolean,
    is_owner: boolean,
  ): Promise<Participant> {
    if (!is_admin)
      throw new UnauthorizedException('Only Admins can remove participants');
    if (is_owner)
      throw new UnauthorizedException(
        'Owners can not be removed from the group',
      );
    return await this.prisma.participant.delete({
      where: {
        user_id_conversation_id: {
          user_id: pid,
          conversation_id: cid,
        },
      },
    });
  }

  async leaveGroup(
    uid: string,
    cid: string,
    is_owner: boolean,
  ): Promise<Participant> {
    if (is_owner) throw new BadRequestException('User cannot lead group');
    return await this.prisma.participant.delete({
      where: {
        user_id_conversation_id: {
          user_id: uid,
          conversation_id: cid,
        },
      },
    });
  }
}
