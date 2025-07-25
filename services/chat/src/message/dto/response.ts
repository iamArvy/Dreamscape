import { Message } from 'src/db/schemas/message.schema';

export class MessageResponse implements Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: Date;
  updated_at: Date;
}
