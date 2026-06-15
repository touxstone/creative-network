export interface MessagingUser {
  id: string;
  name: string | null;
  username: string;
  profession: string | null;
  location: string | null;
}

export interface ConversationPreview {
  id: string;
  updatedAt: Date;
  participants: Array<{
    user: MessagingUser;
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
    sender: Pick<MessagingUser, 'id' | 'name' | 'username'>;
  }>;
}

export interface MessageThread {
  id: string;
  participants: Array<{
    user: MessagingUser;
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
    sender: Pick<MessagingUser, 'id' | 'name' | 'username'>;
  }>;
}

export interface MessagingOverview {
  conversations: ConversationPreview[];
  contactsWithoutConversation: MessagingUser[];
  stats: {
    conversations: number;
    availableContacts: number;
  };
}
