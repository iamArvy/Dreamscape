import { ParticipantService } from './participant/participant.service';
import { ConversationService } from './conversation/conversation.service';
import { User } from './../types/index';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from './message/message.service';
import { Conversation } from './conversation/conversation.schema';
import { Message } from './message/message.schema';
import { Participant } from './participant/participant.schema';
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
        conversation_id: conversation._id as string,
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
      conversation_id: conversation._id as string,
      isAdmin: true,
    });

    if (!users || users.length == 0) return conversation;

    for (const user of users) {
      await this.participant.create({
        user_id: user.id,
        name: user.name,
        avatar: user.avatar,
        conversation_id: conversation._id as string,
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
      conversation_id: cid,
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
      reply_id: rid ?? undefined,
      conversation_id: cid,
    });
  }

  async updateMessage(
    cid: string,
    mid: string,
    uid: string,
    text: string,
  ): Promise<Message | null> {
    await this.participant.getParticipantWithUserAndConversation(uid, cid);
    await this.message.isSender(mid, uid);
    return await this.message.update(mid, { text }).lean();
  }

  async deleteMessage(uid: string, mid: string, cid: string): Promise<boolean> {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    const isSender = await this.message.isSender(mid, uid);

    if (!isAdmin || !isSender) throw new UnauthorizedException();
    await this.message.deleteMessage(mid);
    return true;
  }

  async getUserConversations(uid: string) {
    const participants = await this.participant.participants({ user_id: uid });

    const conversationIds: string[] = participants.map(
      (p: Participant) => p.conversation_id,
    );

    if (!conversationIds.length) return [];

    return await this.conversation.findMany(conversationIds);
  }

  async getConversation(uid: string, cid: string) {
    const inConversation =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!inConversation)
      throw new UnauthorizedException('User not in conversation');

    return await this.conversation.findOne(cid);
  }

  async getConversationMessages(
    uid: string,
    cid: string,
  ): Promise<Message[] | []> {
    const inConversation =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!inConversation) throw new UnauthorizedException();
    return this.message.conversationMessages(cid);
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
    await participant?.deleteOne();
    return participant;
  }

  async leaveGroup(uid: string, cid: string): Promise<Participant> {
    const participant =
      await this.participant.getParticipantWithUserAndConversation(uid, cid);
    if (!participant) throw new NotFoundException();
    await participant.deleteOne();
    return participant;
  }

  async deleteGroup(uid: string, cid: string): Promise<Conversation | null> {
    const conversation = await this.conversation.findOne(cid);
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (!isOwner)
      throw new UnauthorizedException('Only Owners can delete groups');
    await conversation?.deleteOne();
    return conversation;
  }

  async makeAdmin(uid: string, cid: string, pid: string) {
    const isAdmin = await this.participant.isAdmin(uid, cid);
    if (!isAdmin)
      throw new UnauthorizedException('Only Admins can make others Admins');

    const participant =
      await this.participant.getParticipantWithUserAndConversation(pid, cid);

    if (!participant) throw new NotFoundException('User not found in group');
    if (participant.isAdmin) return participant;
    return await this.participant.update(pid, { isAdmin: true });
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
    return await this.participant.update(pid, { isAdmin: false });
  }

  async changeOwnership(uid: string, cid: string, pid: string) {
    const isOwner = await this.conversation.isOwner(cid, uid);
    if (!isOwner)
      throw new UnauthorizedException('Only Owners can change Ownership');

    const participant =
      await this.participant.getParticipantWithUserAndConversation(pid, cid);

    if (!participant) throw new NotFoundException('User not found in group');

    return await this.conversation.update(cid, {
      creator: participant.user_id,
    });
  }
}
