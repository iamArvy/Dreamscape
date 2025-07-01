import { Participant } from '@prisma/client';

export class ParticipantResponse implements Participant {
  id: string;
  user_id: string;
  is_admin: boolean;
  conversation_id: string;
  created_at: Date;
  updated_at: Date;
}
