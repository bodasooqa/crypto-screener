import { useEffect, useMemo, useState } from 'react';
import { BybitKline, BybitKlineItem } from '../../models/bybit.model';
import { createChart, IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts';
import { getColor } from '../../utils/kline.utils';

type IUseKlineData = [
  string,
  string,
  LineData[]
]

export const useKlineData = (kline: BybitKline): IUseKlineData => {
  const actualPrice = useMemo(() => {
    return kline[kline.length - 1]?.c;
  }, [kline]);

  const actualColor = useMemo(() => {
    return getColor(kline, {
      red: 'red',
      green: 'green',
      normal: 'normal',
    });
  }, [kline]);

  const chartData = useMemo(() => {
    return kline.map(candle => ({
      time: candle.t as UTCTimestamp,
      value: Number(candle.c)
    }));
  }, [kline]);

  return [actualPrice, actualColor, chartData];
}

export const useSocket = (pair: string, callback: (candleData: BybitKlineItem) => void) => {
  return () => {
    const wsClient = new WebSocket(process.env.REACT_APP_BYBIT_WSS as string);

    wsClient.addEventListener('open', () => {
      console.log('Opened');
      wsClient.send(JSON.stringify({
        op: 'subscribe',
        args: [`kline.1m.${ pair }`],
      }));
    });

    wsClient.addEventListener('message', ({ data }) => {
      const parsedData = JSON.parse(data);
      const candleData: BybitKlineItem = parsedData.data;

      if (!!candleData) {
        console.log('New message:')
        console.log(candleData.t, candleData.c);

        callback(candleData);
      }
    });
  };
}

interface IUseChart {
  initChart(element: HTMLDivElement): void;
  updateChart(chartData: LineData[]): void;
}

export const useChart = (): IUseChart => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Area'> | null>(null);

  const initChart = (element: HTMLDivElement) => {
    setChart(createChart(element as HTMLElement, {
      width: element.clientWidth,
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
    }));
  }

  useEffect(() => {
    if (!!chart && !lineSeries) {
      setLineSeries(chart.addAreaSeries({
        crosshairMarkerVisible: false,
        lineColor: '#192837',
        topColor: '#192837',
        bottomColor: 'rgba(25, 40, 55, 0.2)',
        baseLineVisible: false,
        priceLineVisible: false
      }));
    }
  }, [chart]);

  const updateChart = (chartData: LineData[]) => {
    if (!!lineSeries) {
      const color = getColor(chartData, {
        green: 'rgba(16, 160, 115, $)',
        red: 'rgba(215, 113, 113, $)',
        normal: 'rgba(25, 40, 55, $)'
      });
      const mainColor = color.replace('$', '1');
      const bottomColor = color.replace('$', '0.2');

      lineSeries.setData(chartData);
      lineSeries.applyOptions({
        lineColor: mainColor,
        topColor: mainColor,
        bottomColor: bottomColor
      })
      chart?.timeScale().fitContent();
    }
  }

  return { initChart, updateChart };
}
