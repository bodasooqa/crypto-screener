import React, { FC, useContext, useEffect, useState } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { BybitKline } from '../../models/bybit.model';
import { useChart, useKlineData, useSocket } from './PartItem.hooks';
import { updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';

interface PairItemProps {
  exchange: string;
  pair: string;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ exchange, pair }) => {
  const { network } = useContext(Context);

  const chartId = `chart-${ pair }`;

  const [kline, setKline] = useState<BybitKline>([]);

  const [getKline, isLoading, error] = useFetching(async () => {
    const { data } = await network.bybit.getKline(pair, '1m', 20);
    setKline(data)
  });

  const { actualPrice, actualColor, chartData } = useKlineData(kline);
  const { chartInitiated, initChart, updateChart } = useChart();
  const { initSocket, closeConnection } = useSocket(pair, (candleData) => {
    setKline(oldKline => {
      const updatedKline = updateKline(oldKline, candleData);
      return [...updatedKline];
    });
  });

  const initPair = async () => {
    await getKline();

    setTimeout(() => {
      initChart(chartId);
      initSocket();
    }, 0)
  }

  useEffect(() => {
    if (chartInitiated) {
      updateChart(chartData);
    }
  }, [chartInitiated, chartData]);

  useEffect(() => {
    initPair();

    return () => {
      closeConnection();
    }
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
          <div id={ chartId } className="pair-item__chart"></div>
        </div> }
    </div>
  );
};

export default PairItem;
