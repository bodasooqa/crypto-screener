import { BybitKline, BybitKlineItem } from '../models/bybit.model';
import { KlineColorSet, Kline, ExchangeKline, KlineItem } from '../models/kline.model';
import { LineData } from 'lightweight-charts';
import { Exchange } from '../models/exchange.model';
import { BinanceKline } from '../models/binance.model';

export const getColor = (kline: Kline | LineData[], colorSet: KlineColorSet) => {
  if (kline?.length) {
    const lastClose = 'c' in kline[0]
      ? (kline[kline.length - 1] as KlineItem)?.c
      : (kline[kline.length - 1] as LineData)?.value;

    const preLastClose = 'c' in kline[0]
      ? (kline[kline.length - 2] as KlineItem)?.c
      : (kline[kline.length - 2] as LineData)?.value;

    if (lastClose < preLastClose) {
      return colorSet.red;
    } else if (lastClose > preLastClose) {
      return colorSet.green;
    } else {
      return colorSet.normal;
    }
  } else {
    return colorSet.normal;
  }
}

export const updateKline = (kline: Kline, candle: KlineItem): Kline => {
  if (kline[kline.length - 1].t === candle.t) {
    kline[kline.length - 1] = candle;
  } else {
    kline.shift();
    kline.push(candle);
  }

  return kline;
}

export const formatKline = (data: ExchangeKline, exchange: Exchange): Kline => {
  switch (exchange) {
    case Exchange.BYBIT:
      return data as BybitKline;
    case Exchange.BINANCE:
      return (data as BinanceKline).map(item => ({
        t: item[0],
        c: item[4],
      }));
  }
}
