import { Exchange, KlineInterval } from './exchange.model';

export interface ISettingsItem {
  avgVolNumber: number | null;
  id: string;
  interval: KlineInterval;
  symbol: string;
  exchange: Exchange;
}

export type INewSettingsItem = Omit<ISettingsItem, 'id'>;

export interface ISettingsCollection {
  [key: string]: ISettingsItem;
}

export interface ISettingsLoading {
  all: boolean;
  pairs: string[];
}
