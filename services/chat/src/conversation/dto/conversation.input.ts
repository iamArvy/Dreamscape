export class StartConversationInput {
  user_id: string;
  recipient_id: string;
}

export class GetConversationInput {
  id: string;
  user_id: string;
}

export class GetConversationsInput {
  user_id: string;
}
