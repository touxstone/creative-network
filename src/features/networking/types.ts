import type { Connection, User } from '@prisma/client';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED' | 'REJECTED';

export type NetworkUser = Pick<
  User,
  'id' | 'name' | 'username' | 'profession' | 'location' | 'bio'
>;

export type ConnectionWithUsers = Connection & {
  userA: NetworkUser;
  userB: NetworkUser;
};

export interface NetworkOverview {
  suggestions: NetworkUser[];
  connections: ConnectionWithUsers[];
  receivedRequests: ConnectionWithUsers[];
  sentRequests: ConnectionWithUsers[];
  stats: {
    connections: number;
    receivedRequests: number;
    sentRequests: number;
    suggestions: number;
  };
}
