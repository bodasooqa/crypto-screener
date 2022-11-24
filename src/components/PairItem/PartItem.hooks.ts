import { useEffect, useMemo, useState } from 'react';
import { BybitKline, BybitKlineItem } from '../../models/bybit.model';
import { createChart, IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts';
import { getColor } from '../../utils/kline';
import { baseChartConfig, baseLineConfig } from '../../utils/constants';
import { logWS } from '../../utils/logger';

export const useKlineData = (kline: BybitKline) => {
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

  return { actualPrice, actualColor, chartData };
}

export const useSocket = (pair: string, callback: (candleData: BybitKlineItem) => void) => {
  const [wsClient, setWsClient] = useState<WebSocket | null>(null);
  const [wsClientInitiated, setWsClientInitiated] = useState(false);

  const initSocket = () => {
    setWsClient(new WebSocket(process.env.REACT_APP_BYBIT_WSS as string));
  }

  const closeConnection = () => {
    wsClient?.close();
  }

  const onOpen = () => {
    logWS('Opened');

    wsClient?.send(JSON.stringify({
      op: 'subscribe',
      args: [`kline.1m.${ pair }`],
    }));

    setInterval(() => {
      logWS('ping')

      wsClient?.send(JSON.stringify({
        op: 'ping'
      }));
    }, 30000);
  }

  const onMessage = ({ data }: MessageEvent) => {
    const parsedData = JSON.parse(data);
    const candleData: BybitKlineItem = parsedData.data;

    if (data.op === 'pong') {
      logWS('Pong received')
    }

    if (!!candleData) {
      logWS('Message received:', candleData)

      callback(candleData);
    }
  }

  useEffect(() => {
    if (!!wsClient && !wsClientInitiated) {
      setWsClientInitiated(true);

      wsClient.addEventListener('open', onOpen);
      wsClient.addEventListener('message', onMessage);
      wsClient.addEventListener('close', () => {
        logWS('Connection closed');
      });
    }
  }, [wsClient]);

  return { initSocket, closeConnection };
}

export const useChart = () => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Area'> | null>(null);
  const [chartInitiated, setChartInitiated] = useState(false);

  const initChart = (chartId: string) => {
    const element = document.getElementById(chartId) as HTMLDivElement;
    setChart(createChart(element as HTMLDivElement, {
      ...baseChartConfig,
      width: element.clientWidth,
    }));
  }

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

  useEffect(() => {
    if (!!chart && !lineSeries) {
      setLineSeries(chart.addAreaSeries(baseLineConfig));
    }
  }, [chart]);

  useEffect(() => {
    if (!!chart && !!lineSeries && !chartInitiated) {
      setChartInitiated(true);
    }
  }, [chart, lineSeries]);

  return { chartInitiated, initChart, updateChart };
}
