import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({
  timestamps: true,
  collection: 'conversations',
})
export class Conversation {
  @Prop()
  name?: string;

  @Prop()
  group?: boolean;

  @Prop()
  creator?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
