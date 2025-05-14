import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Participant, ParticipantDocument } from './participant.schema';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
  ) {}

  async create(data: Partial<Participant>) {
    return await this.participantModel.create(data);
  }

  participants(filters: FilterQuery<Participant>) {
    return this.participantModel.find(filters);
  }

  participant(id): Promise<ParticipantDocument | null> {
    try {
      return this.participantModel.findById(id);
    } catch (error) {
      throw new Error(error as string);
      // handlePrismaError(error, modelName);
    }
  }

  getParticipantWithUserAndConversation(
    uid: string,
    cid: string,
  ): Promise<ParticipantDocument | null> {
    return this.participantModel.findOne({
      user_id: uid,
      conversation_id: cid,
    });
  }

  update(id: string, data: Partial<Participant>) {
    return this.participantModel.findByIdAndUpdate(id, data);
  }

  async delete(id): Promise<ParticipantDocument | null> {
    return this.participantModel.findByIdAndDelete(id);
  }

  async isAdmin(uid: string, cid: string): Promise<boolean> {
    const user = await this.getParticipantWithUserAndConversation(uid, cid);
    if (user?.isAdmin) return true;
    return false;
  }
}
