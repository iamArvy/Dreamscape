import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message {
  @Prop({ required: true })
  conversation_id: string;

  @Prop({ required: true })
  sender_id: string;

  @Prop()
  reply_id?: string;

  @Prop({ required: true })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
