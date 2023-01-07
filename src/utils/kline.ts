import { BybitKline } from '../models/bybit.model';
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

export const getChartColor = (chartData: LineData[], dayOpenPrice: number, colorSet: KlineColorSet) => {
  if (chartData[chartData.length - 1]?.value > dayOpenPrice) {
    return colorSet.green;
  } else if (chartData[chartData.length - 1]?.value < dayOpenPrice) {
    return colorSet.red;
  } else {
    return colorSet.normal;
  }
}

export const updateKline = (kline: Kline, candle: KlineItem): Kline => {
  if (!!kline.length) {
    if (kline[kline.length - 1].t === candle.t) {
      kline[kline.length - 1] = candle;
    } else {
      kline.push(candle);
    }
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
        o: item[1],
        c: item[4],
        v: item[5],
      }));
  }
}

export const getUTCDayStart = (): number => {
  const date = new Date();
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.getTime();
};
