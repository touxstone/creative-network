import type { Notification } from '@prisma/client';
import type { NotificationType } from './constants';

export interface NotificationActor {
  id: string;
  name: string | null;
  username: string;
  profession: string | null;
}

export type NotificationItem = Omit<Notification, 'type'> & {
  type: NotificationType | string;
  actor: NotificationActor | null;
};
