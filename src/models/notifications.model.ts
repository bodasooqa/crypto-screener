import { Exchange } from './exchange.model';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export enum NotificationType {
  CROSS = 'cross',
}

export enum NotificationWorkType {
  ONCE = 'once',
  EVERY = 'every'
}

export interface INotification {
  id: string;
  type: NotificationType;
  workType: NotificationWorkType;
  price: number;
  momentPrice: number;
  symbol: string;
  exchange: Exchange;
}

export type INewNotification = Omit<INotification, 'id'>;

export interface INotificationsCollection {
  [key: string]: INotification[]
}

export interface INotificationSet {
  momentPrice: string;
  notification: INotification;
}

export interface INotificationsLoading {
  all: boolean;
  pairs: string[];
}

export interface IBarNotification {
  id: string;
  title?: string;
  text: string;
  icon?: IconDefinition;
  color?: string;
}

export type INewBarNotification = Omit<IBarNotification, 'id'>;
