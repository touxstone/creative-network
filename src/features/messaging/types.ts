export interface MessagingUser {
  id: string;
  name: string | null;
  username: string;
  profession: string | null;
  location: string | null;
}

export interface ConversationPreview {
  id: string;
  title: string | null;
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
    editedAt: Date | null;
    editCount: number;
  }>;
}

export interface ThreadMessage {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date | null;
  editCount: number;
  senderId: string;
  sender: Pick<MessagingUser, 'id' | 'name' | 'username'>;
  replyTo: {
    id: string;
    content: string;
    sender: Pick<MessagingUser, 'id' | 'name' | 'username'>;
  } | null;
  editHistory: Array<{
    id: string;
    createdAt: Date;
    reason: string | null;
  }>;
}

export interface MessageThread {
  id: string;
  title: string | null;
  pinnedMessageId: string | null;
  pinnedColor: string;
  pinnedMessage: ThreadMessage | null;
  participants: Array<{
    user: MessagingUser;
  }>;
  messages: ThreadMessage[];
}

export interface MessagingOverview {
  conversations: ConversationPreview[];
  contactsWithoutConversation: MessagingUser[];
  stats: {
    conversations: number;
    availableContacts: number;
  };
}
