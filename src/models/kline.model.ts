import { BinanceKline } from './binance.model';
import { BybitKline } from './bybit.model';

export enum KlineColor {
  GREEN = 'green',
  RED = 'red',
  NORMAL = 'normal',
}

export interface KlineColorSet {
  green: string | KlineColor;
  red: string | KlineColor;
  normal: string | KlineColor;
}

export interface KlineItem {
  t: number;
  o: string;
  c: string;
  v: string;
}

export type Kline = KlineItem[];

export type ExchangeKline = BinanceKline | BybitKline;
