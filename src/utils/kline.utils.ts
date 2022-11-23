import { BybitKline, BybitKlineItem } from '../models/bybit.model';
import { KlineColorSet } from '../api/kline.model';
import { LineData } from 'lightweight-charts';

export const getColor = (kline: BybitKline | LineData[], colorSet: KlineColorSet) => {
  if (kline?.length) {
    const lastClose = 'c' in kline[0]
      ? (kline[kline.length - 1] as BybitKlineItem)?.c
      : (kline[kline.length - 1] as LineData)?.value;

    const preLastClose = 'c' in kline[0]
      ? (kline[kline.length - 2] as BybitKlineItem)?.c
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

export const updateKline = (kline: BybitKline, candle: BybitKlineItem): BybitKline => {
  if (kline[kline.length - 1].t === candle.t) {
    kline[kline.length - 1] = candle;
  } else {
    kline.shift();
    kline.push(candle);
  }

  return kline;
}
