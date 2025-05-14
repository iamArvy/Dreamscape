import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from './conversation.schema';
import { Model, Types } from 'mongoose';
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversation: Model<ConversationDocument>,
  ) {}

  create(data: Partial<ConversationDocument>) {
    return this.conversation.create(data);
  }

  findMany(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    return this.conversation.find({ _id: { $in: objectIds } });
  }

  findOne(id: string) {
    return this.conversation.findById(id).exec();
  }

  update(id: string, data: Partial<Conversation>) {
    return this.conversation.findByIdAndUpdate(id, data);
  }

  remove(id: string) {
    return this.conversation.findByIdAndDelete(id);
  }

  // async delete(
  //   where: Prisma.ConversationWhereUniqueInput,
  // ): Promise<Conversation> {
  //   return this.prisma.conversation.delete({
  //     where,
  //   });
  // }

  async isOwner(cid: string, uid: string): Promise<boolean> {
    const conversation = await this.conversation.findById({ id: cid });

    if (conversation && conversation.creator === uid) return true;

    return false;
  }
}
