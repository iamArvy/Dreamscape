import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schema';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private message: Model<MessageDocument>,
  ) {}

  conversationMessages(cid: string): Promise<MessageDocument[] | []> {
    return this.message.find({
      conversation_id: cid,
    });
  }

  async getConversationMessage(id: string, cid: string) {
    const message = await this.message
      .findOne({
        _id: id,
        conversation_id: cid,
      })
      .lean();
    if (!message)
      throw new NotFoundException('Message not found in conversation');
    return message;
  }

  async getConversationMessages(
    uid: string,
    cid: string,
  ): Promise<Message[] | []> {
    return this.message.find({
      conversation_id: cid,
    });
  }

  async sendMessage(
    cid: string,
    uid: string,
    text: string,
    rid?: string,
  ): Promise<Message> {
    return await this.message.create({
      sender_id: uid,
      text: text,
      reply_id: rid ?? undefined,
      conversation_id: cid,
    });
  }

  async updateMessage(
    uid: string,
    mid: string,
    text: string,
  ): Promise<Message> {
    const message = await this.message.findOneAndUpdate(
      { _id: mid, sender_id: uid },
      { text },
    );
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async deleteMessage(uid: string, mid: string): Promise<Message> {
    // accept is admin from the controller or resolver instead
    // const isAdmin = await this.participant.isAdmin(uid, cid);
    // const isSender = await this.message.isSender(mid, uid);

    const message = await this.message.findOneAndDelete({
      _id: mid,
      sender_id: uid,
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }
}
