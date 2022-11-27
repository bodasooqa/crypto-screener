import React, { FC, useContext, useEffect } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { useChart, useKlineData, useSocket } from './PartItem.hooks';
import { formatKline, updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';
import { Exchange, KlineInterval } from '../../models/exchange.model';

interface PairItemProps {
  exchange: Exchange;
  pair: string;
  interval: KlineInterval;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ exchange, pair, interval }) => {
  const { network } = useContext(Context);

  const chartId = `chart-${ exchange }-${ pair }`;

  const [getKline, isLoading, error] = useFetching(async () => {
    const { data } = await network[exchange].getKline(pair, interval);
    const klineData = formatKline(data, exchange);
    setDayOpenPrice(Number(klineData[0].o));
    setKline(klineData);
  });

  const {
    actualPrice,
    actualColor,
    chartData,
    dayOpenPrice,
    percentDiff,
    percentColor,
    actualVolume,
    middleVolume,
    volumePercentDiff,
    setKline,
    setDayOpenPrice
  } = useKlineData();
  const { chartInitiated, initChart, updateChart } = useChart();
  const { initSocket, closeConnection } = useSocket(pair, exchange, interval, (candleData) => {
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
      updateChart(chartData, dayOpenPrice);
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
        <span className={ ['pair-item__percent', `pair-item__percent--${ percentColor }`].join(' ') }>
          { percentDiff > 0 ? '+' : '' }
          { percentDiff.toFixed(2) }%
        </span>
      </span>

      { isLoading
        ? <div className="pair-item__loading-state">
          <Loader />
        </div>
        : <div className="pair-item__content">
          <span className={ ['pair-item__actual-price', `pair-item__actual-price--${ actualColor }`].join(' ') }>
            { actualPrice }
          </span>
          <span className="pair-item__volume">
            <b>Vol:</b>
            { actualVolume.toFixed(2) }
            <span className='pair-item__volume-percent-diff'>
              { volumePercentDiff > 0 ? '+' : '' }
              { volumePercentDiff.toFixed(2) }%
            </span>
            <span className='pair-item__middle-volume'>
              ({ middleVolume.toFixed(2) })
            </span>
          </span>
          <div id={ chartId } className="pair-item__chart"></div>
        </div> }
    </div>
  );
};

export default PairItem;
