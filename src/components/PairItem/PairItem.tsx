import React, { FC, useContext, useEffect, useState } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { useChart, useKlineData, useNotifications, useSocket } from './PartItem.hooks';
import { formatKline, updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';
import { Exchange, KlineInterval } from '../../models/exchange.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';

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
  const { notificationsCount } = useNotifications();

  const [notificationsOpened, setNotificationsOpened] = useState(false);

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
      <div className="pair-item__header">
        <div className="pair-item__header__text">
          <span className="pair-item__exchange">
            { exchange.toUpperCase() }
          </span>
          <span className="pair-item__symbol">
            { pair }
            <span className={ ['pair-item__percent', `pair-item__percent--${ percentColor }`].join(' ') }>
              { percentDiff > 0 && '+' }
              { percentDiff.toFixed(2) }%
            </span>
          </span>
        </div>
        <div className="pair-item__header__actions">
          <button className="pair-item__button">
            <FontAwesomeIcon icon={ faGear } size="sm" />
          </button>
          <button
            className={ `pair-item__button ${ notificationsOpened && 'pair-item__button--active' }` }
            onClick={ () => setNotificationsOpened(!notificationsOpened) }
          >
            <FontAwesomeIcon icon={ faBell } size="sm" />
            { !!notificationsCount && <span className="pair-item__badge">{ notificationsCount }</span> }
          </button>
        </div>
      </div>

      { notificationsOpened
        && <div className="pair-item__popup">

        </div>
      }


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
            <span className="pair-item__volume-percent-diff">
              { volumePercentDiff > 0 ? '+' : '' }
              { volumePercentDiff.toFixed(2) }%
            </span>
            <span className="pair-item__middle-volume">
              ({ middleVolume.toFixed(2) })
            </span>
          </span>
          <div id={ chartId } className="pair-item__chart"></div>
        </div>
      }
    </div>
  );
};

export default PairItem;
