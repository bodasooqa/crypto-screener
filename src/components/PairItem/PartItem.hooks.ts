import { useEffect, useMemo, useState } from 'react';
import { BybitKlineItem } from '../../models/bybit.model';
import { createChart, IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts';
import { getColor } from '../../utils/kline';
import { baseChartConfig, baseLineConfig } from '../../utils/constants';
import { logWS } from '../../utils/logger';
import { Kline } from '../../models/kline.model';
import { Exchange, KlineInterval } from '../../models/exchange.model';

export const useKlineData = (kline: Kline) => {
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

export const useSocket = (
  pair: string,
  exchange: Exchange,
  interval: KlineInterval,
  callback: (candleData: BybitKlineItem) => void
) => {
  const [wsClient, setWsClient] = useState<WebSocket | null>(null);
  const [wsClientInitiated, setWsClientInitiated] = useState(false);
  const [pingInterval, setPingInterval] = useState<NodeJS.Timer | null>(null);

  const getWSSEndpoint = (): string => {
    switch (exchange) {
      case Exchange.BYBIT:
        return process.env.REACT_APP_BYBIT_WSS!;
      case Exchange.BINANCE:
        return `${ process.env.REACT_APP_BINANCE_WSS }/${ pair.toLowerCase() }@kline_1m`;
    }
  }

  const getWSSParams = (): any => {
    switch (exchange) {
      case Exchange.BYBIT:
        return {
          op: 'subscribe',
          args: [`kline.1m.${ pair }`],
        }
      case Exchange.BINANCE:
        return {
          method: 'SUBSCRIBE',
          params: [`${ pair.toLowerCase() }@kline_1m`]
        }
    }
  }

  const initSocket = () => {
    setWsClient(
      new WebSocket(
        getWSSEndpoint()
      )
    );
  }

  const closeConnection = () => {
    if (!!pingInterval) {
      clearInterval(pingInterval);
    }

    wsClient?.close();
  }

  const onOpen = () => {
    logWS('Opened');

    if (exchange === Exchange.BYBIT) {
      wsClient?.send(
        JSON.stringify(
          getWSSParams()
        )
      );

      setPingInterval(
        setInterval(() => {
          logWS('ping')

          wsClient?.send(JSON.stringify({
            op: 'ping'
          }));
        }, 30000)
      );
    }
  }

  const onMessage = ({ data }: MessageEvent) => {
    const parsedData = JSON.parse(data);
    const candleData: BybitKlineItem = parsedData.data || parsedData.k;

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
