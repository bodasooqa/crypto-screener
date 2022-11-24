import React, { createRef, FC, useContext, useEffect, useState } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { BybitKline } from '../../models/bybit.model';
import { useChart, useKlineData, useSocket } from './PartItem.hooks';
import { updateKline } from '../../utils/kline.utils';
import Loader from '../Loader/Loader';

interface PairItemProps {
  exchange: string;
  pair: string;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ exchange, pair }) => {
  const { network } = useContext(Context);

  const [kline, setKline] = useState<BybitKline>([]);

  const [actualPrice, actualColor, chartData] = useKlineData(kline);

  const { initChart, updateChart } = useChart();

  const [getKline, isLoading, error] = useFetching(async () => {
    const { data } = await network.bybit.getKline(pair, '1m', 20);
    setKline(data)
  });

  const initSocket = useSocket(pair, (candleData) => {
    setKline(oldKline => {
      const updatedKline = updateKline(oldKline, candleData);
      return [...updatedKline];
    });
  });

  const chartRef = createRef<HTMLDivElement>();

  const initPair = async (element: HTMLDivElement) => {
    await getKline();
    initSocket();
    initChart(element);
  }

  useEffect(() => {
    updateChart(chartData);
  }, [chartData]);

  useEffect(() => {
    initPair(chartRef.current as HTMLDivElement);
  }, []);

  return (
    <div className="pair-item">
      <span className="pair-item__exchange">
        { exchange.toUpperCase() }
      </span>
      <span className="pair-item__symbol">
        { pair }
      </span>

      { isLoading
        ? <div className="pair-item__loading-state">
          <Loader />
        </div>
        : <div className="pair-item__content">
          <span className={ ['pair-item__actual-price', `pair-item__actual-price--${ actualColor }`].join(' ') }>
            { actualPrice }
          </span>
          <div ref={ chartRef } className="pair-item__chart"></div>
        </div> }
    </div>
  );
};

export default PairItem;
