import { User } from './../types/index';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Conversation, Message, Participant } from 'generated/prisma';
import {
  ConversationService,
  MessageService,
  ParticipantService,
} from './services';

@Injectable()
export class AppService {
  constructor(
    private readonly participant: ParticipantService,
    private readonly message: MessageService,
    private readonly conversation: ConversationService,
  ) {}

  async startNewConversation(users: User[]): Promise<Conversation> {
    const conversation = await this.conversation.create({});

    for (const user of users) {
      await this.participant.create({
        user_id: user.id,
        name: user.name,
        avatar: user.avatar,
        conversationId: conversation.id,
      });
    }

    return conversation;
  }

  async createGroup(creator: User, users: User[]): Promise<Conversation> {
    const conversation = await this.conversation.create({
      group: true,
    });

    await this.participant.create({
      user_id: creator.id,
      name: creator.name,
      avatar: creator.avatar,
      conversationId: conversation.id,
      isAdmin: true,
    });

    if (!users || users.length == 0) return conversation;

    for (const user of users) {
      await this.participant.create({
        user_id: user.id,
        name: user.name,
        avatar: user.avatar,
        conversationId: conversation.id,
      });
    }

    return conversation;
  }

  async addUserToGroup(
    uid: string,
    cid: string,
    mid: User,
  ): Promise<Participant> {
    await this.participant.isAdmin(uid, cid);
    return this.participant.create({
      user_id: mid.id,
      avatar: mid.avatar,
      name: mid.name,
      conversationId: cid,
    });
  }

  async sendMessage(
    cid: string,
    uid: string,
    text: string,
    rid?: string,
  ): Promise<Message> {
    await this.participant.getParticipantWithUserAndConversation(uid, cid);
    return await this.message.create({
      sender_id: uid,
      text: text,
      reply_to_id: rid ?? undefined,
      conversationId: cid,
    });
  }

  async updateMessage(
    cid: string,
    mid: string,
    uid: string,
    text: string,
  ): Promise<Message> {
    await this.participant.getParticipantWithUserAndConversation(uid, cid);
    await this.message.isSender(mid, uid);
    return await this.message.update({
      where: {
        id: mid,
      },
      data: {
        text: text,
      },
    });
  }

  async deleteMessage(uid: string, mid: string, cid: string): Promise<Message> {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    const isSender = await this.message.isSender(mid, uid);

    if (!isAdmin || !isSender) throw new UnauthorizedException();

    return this.message.delete({
      id: mid,
    });
  }

  async getUserConversations(uid: string) {
    const participants = await this.participant.participants({
      where: { user_id: uid },
      select: {
        conversationId: true,
      },
    });

    const conversationIds: string[] = participants.map(
      (p: Participant) => p.conversationId,
    );

    if (!conversationIds.length) return [];

    return await this.conversation.conversations({
      where: {
        id: { in: conversationIds },
      },
    });
  }

  async getConversation(uid: string, cid: string) {
    const inConversation =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!inConversation)
      throw new UnauthorizedException('User not in conversation');

    return await this.conversation.conversation({
      where: { id: cid },
    });
  }

  async getConversationMessages(
    uid: string,
    cid: string,
  ): Promise<Message[] | []> {
    const inConversation =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!inConversation) throw new UnauthorizedException();
    return this.message.messages({
      where: {
        conversationId: cid,
      },
    });
  }

  async getConversationParticipants(
    uid: string,
    cid: string,
  ): Promise<Participant[] | []> {
    const inConversation =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!inConversation) throw new UnauthorizedException();
    return await this.participant.participants({
      where: {
        conversationId: cid,
      },
    });
  }

  async removeUserFromGroup(
    uid: string,
    cid: string,
    pid: string,
  ): Promise<Participant> {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    if (!isAdmin)
      throw new UnauthorizedException('Only Admins can remove users');
    const participant = await this.participant.participant({
      where: { id: pid },
    });
    if (!participant) throw new NotFoundException('User not found in group');
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (isOwner)
      throw new UnauthorizedException('Cannot Delete Owner from group');
    return await this.participant.delete({ id: participant.id });
  }

  async leaveGroup(uid: string, cid: string): Promise<Participant> {
    const participant =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!participant) throw new NotFoundException();
    return await this.participant.delete({ id: participant.id });
  }

  async deleteGroup(uid: string, cid: string): Promise<Conversation> {
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (!isOwner)
      throw new UnauthorizedException('Only Owners can delete groups');

    return await this.conversation.delete({
      id: cid,
    });
  }

  async makeAdmin(uid: string, cid: string, pid: string) {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    if (!isAdmin)
      throw new UnauthorizedException('Only Admins can make others Admins');

    const participant =
      await this.participant.getParticipantWithUserAndConversation(pid, cid);

    if (!participant) throw new NotFoundException('User not found in group');
    if (participant.isAdmin) return participant;
    return await this.participant.update({
      where: { id: participant.id },
      data: {
        isAdmin: true,
      },
    });
  }

  async removeAdmin(uid: string, cid: string, pid: string) {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    if (!isAdmin)
      throw new UnauthorizedException('Only Admins can delete other admins');

    const participant =
      await this.participant.getParticipantWithUserAndConversation(pid, cid);

    if (!participant) throw new NotFoundException('User not found in group');
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (!isOwner)
      throw new UnauthorizedException('Owners can not be removed from admin');
    if (!participant.isAdmin) return participant;
    return await this.participant.update({
      where: { id: participant.id },
      data: {
        isAdmin: undefined,
      },
    });
  }

  async changeOwnership(uid: string, cid: string, pid: string) {
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (!isOwner)
      throw new UnauthorizedException('Only Owners can change Ownership');

    const participant =
      await this.participant.getParticipantWithUserAndConversation(pid, cid);

    if (!participant) throw new NotFoundException('User not found in group');

    return await this.conversation.update({
      where: {
        id: cid,
      },
      data: {
        creator: participant.user_id,
      },
    });
  }
}
