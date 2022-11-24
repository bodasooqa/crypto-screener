import { BinanceKline } from './binance.model';
import { BybitKline } from './bybit.model';

export interface KlineColorSet {
  green: string;
  red: string;
  normal: string;
}

export interface KlineItem {
  c: string;
  t: number;
}

export type Kline = KlineItem[];

export type ExchangeKline = BinanceKline | BybitKline;
