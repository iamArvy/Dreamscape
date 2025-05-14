import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { FilterQuery, Model } from 'mongoose';
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private message: Model<MessageDocument>,
  ) {}

  create(data: Partial<Message>): Promise<MessageDocument> {
    return this.message.create(data);
  }

  conversationMessages(cid: string): Promise<MessageDocument[] | []> {
    return this.message.find({
      conversation_id: cid,
    });
  }

  find(filters: FilterQuery<Message>) {
    return this.message.find(filters);
  }

  findOne(filters: FilterQuery<Message>) {
    return this.message.findOne(filters).exec();
  }

  update(id: string, data: Partial<MessageDocument>) {
    return this.message.findByIdAndUpdate(id, data);
  }

  async deleteMessage(id: string): Promise<{ deletedCount?: number }> {
    const result = await this.message.findByIdAndDelete(id);
    return result ? { deletedCount: 1 } : { deletedCount: 0 };
  }

  async isSender(id: string, uid: string): Promise<boolean> {
    const message = await this.message.findOne({
      id,
      sender_id: uid,
    });
    if (message) return true;

    return false;
  }
}
