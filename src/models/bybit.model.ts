import { KlineItem } from './kline.model';

export interface BybitKlineItem extends KlineItem {
  h: string;
  l: string;
  o: string;
  s: string;
}

export type BybitKline = BybitKlineItem[];
