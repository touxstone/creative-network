export const notificationTypes = [
  'CONNECTION_REQUEST',
  'CONNECTION_ACCEPTED',
  'POST_LIKE',
  'POST_COMMENT',
  'MESSAGE',
] as const;

export type NotificationType = (typeof notificationTypes)[number];

export const notificationTypeLabels: Record<NotificationType, string> = {
  CONNECTION_REQUEST: 'Connection request',
  CONNECTION_ACCEPTED: 'Connection accepted',
  POST_LIKE: 'Post like',
  POST_COMMENT: 'Post comment',
  MESSAGE: 'Message',
};
