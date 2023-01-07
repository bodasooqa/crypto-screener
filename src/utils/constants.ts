import { ChartOptions, DeepPartial, LastPriceAnimationMode } from 'lightweight-charts';
import { KlineInterval } from '../models/exchange.model';
import { ISelectOption, SelectData } from '../models/ui.model';

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

export const minutes: KlineInterval[] = ['5m', '15m', '30m'];
export const hours: KlineInterval[] = ['1h', '2h', '4h', '6h', '12h'];
export const days: KlineInterval[] = ['1d', '1w', '1M'];

export const intervalOptions: SelectData<KlineInterval> = [
  {
    title: 'Minutes',
    options: minutes.map((value): ISelectOption<KlineInterval> => ({ value })),
  },
  {
    title: 'Hours',
    options: hours.map((value): ISelectOption<KlineInterval> => ({ value })),
  },
  {
    title: 'Days',
    options: days.map((value): ISelectOption<KlineInterval> => ({ value })),
  },
];
