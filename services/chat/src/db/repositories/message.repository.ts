import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { DeleteResult, Model } from 'mongoose';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private message: Model<MessageDocument>,
  ) {}

  getById(id: string) {
    return this.message.findOne({ id });
  }

  async getByIdOrThrow(id: string) {
    const message = await this.message.findOne({ id });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  listByConversation(conversation_id: string): Promise<MessageDocument[] | []> {
    return this.message.find({
      conversation_id,
    });
  }

  async create(data: {
    conversation_id: string;
    sender_id: string;
    text: string;
    reply_id?: string;
  }): Promise<Message> {
    return await this.message.create(data);
  }

  update(id: string, text: string) {
    return this.message.updateOne({ id }, { text }).exec();
  }

  deleteMessage(id: string): Promise<DeleteResult> {
    return this.message
      .deleteOne({
        id,
      })
      .exec();
  }
}
