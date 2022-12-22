import { ChartOptions, DeepPartial, LastPriceAnimationMode } from 'lightweight-charts';
import { KlineInterval } from '../models/exchange.model';

export const baseChartConfig: DeepPartial<ChartOptions> = {
  height: 100,
  grid: {
    vertLines: { visible: false },
    horzLines: { visible: false },
  },
  rightPriceScale: { visible: false },
  timeScale: { visible: false },
  handleScale: false,
  handleScroll: false,
  crosshair: {
    vertLine: {
      visible: false,
      labelVisible: false
    },
    horzLine: {
      visible: false,
      labelVisible: false
    }
  }
};

export const baseLineConfig = {
  crosshairMarkerVisible: false,
  lineColor: '#192837',
  topColor: '#192837',
  bottomColor: 'rgba(25, 40, 55, 0.2)',
  baseLineVisible: false,
  priceLineVisible: false,
  lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate
};

export const intervals: KlineInterval[] = ['1m', '5m', '15m', '30m', '1h'];
