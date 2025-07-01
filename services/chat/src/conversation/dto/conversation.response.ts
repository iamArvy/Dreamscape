import { Conversation } from '@prisma/client';

export class ConversationResponse implements Conversation {
  id: string;
  name: string | null;
  group: boolean | null;
  creator_id: string | null;
  created_at: Date;
  updated_at: Date;
}
