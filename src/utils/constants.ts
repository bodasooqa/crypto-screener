import { ChartOptions, DeepPartial, LastPriceAnimationMode } from 'lightweight-charts';

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
