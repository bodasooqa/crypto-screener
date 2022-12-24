import { Exchange } from './exchange.model';

export enum NotificationType {
  CROSS = 'cross',
}

export enum NotificationWorkType {
  ONCE = 'once',
  EVERY = 'every'
}

export interface INotification {
  type: NotificationType;
  workType: NotificationWorkType;
  price: number;
  symbol: string;
  exchange: Exchange;
}

export interface INotificationsCollection {
  [key: string]: INotification[]
}

export interface INotificationSet {
  key: string;
  notification: INotification;
}

export interface INotificationsLoading {
  all: boolean;
  pairs: string[];
}
