import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({
  timestamps: true,
  collection: 'participants',
})
export class Participant {
  @Prop()
  name?: string;

  @Prop()
  avatar?: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  conversation_id: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
ParticipantSchema.index({ user_id: 1, conversation_id: 1 }, { unique: true });
