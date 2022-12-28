import React, { FC, useContext, useEffect, useMemo, useRef } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { useChart, useKlineData, useSettings, useSocket } from './PartItem.hooks';
import { formatKline, updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';
import { Exchange, KlineInterval } from '../../models/exchange.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBell, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import NotificationOverlay from '../NotificationOverlay/NotificationOverlay';
import CardButton from '../UI/CardButton/CardButton';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';

interface PairItemProps {
  exchange: Exchange;
  pair: string;
  interval: KlineInterval;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ exchange, pair, interval }) => {
  const context = useContext(Context);
  const { network } = context;
  const [globalUser] = useAuth();

  const chartId = `chart-${ exchange }-${ pair }`;

  const errorRef = useRef(null);

  const [getKline, isKlineLoading, error] = useFetching(async () => {
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
  const {
    notifications,
    notificationsOpened,
    notificationsCount,
    notificationsOverlayRef,
    isNotificationsLoading,
    setNotificationsOpened,
    checkNotifications,
    checkAndNotify
  } = useNotifications(pair, exchange);
  const { settingsButtonRef } = useSettings();

  const errorToShow = useMemo(() => {
    return error?.response?.data.msg || error?.response?.data.retMsg || 'Exchange connection error';
  }, [error]);

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
    if (!globalUser) {
      setNotificationsOpened(false);
    }
  }, [globalUser]);

  useEffect(() => {
    checkAndNotify(actualPrice);
  }, [actualPrice]);

  useEffect(() => {
    if (!!notifications.length) {
      checkNotifications(actualPrice);
    }
  }, [notifications]);

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
          <CSSTransition
            in={ !notificationsOpened }
            nodeRef={ settingsButtonRef }
            timeout={ 300 }
            classNames="fade"
            unmountOnExit
          >
            <CardButton
              ref={ settingsButtonRef }
              disabled={ !globalUser }
            >
              <FontAwesomeIcon icon={ faGear } size="sm" />
            </CardButton>
          </CSSTransition>
          <CardButton
            disabled={ !globalUser }
            isActive={ notificationsOpened }
            badge={ notificationsCount }
            onClick={ () => setNotificationsOpened(!notificationsOpened) }
          >
            { !!globalUser && !notificationsOpened && isNotificationsLoading
              ? <Loader size="xs" color="black" />
              : <FontAwesomeIcon icon={ faBell } size="sm" /> }

          </CardButton>

        </div>
      </div>

      <CSSTransition
        in={ notificationsOpened }
        nodeRef={ notificationsOverlayRef }
        timeout={ 500 }
        classNames="overlay-up"
        unmountOnExit
      >
        <NotificationOverlay
          ref={ notificationsOverlayRef }
          exchange={ exchange }
          symbol={ pair }
          momentPrice={ actualPrice }
        />
      </CSSTransition>


      <CSSTransition
        in={ !!error }
        nodeRef={ errorRef }
        timeout={ 300 }
        classNames="fade"
        unmountOnExit
      >
        <div ref={ errorRef } className="pair-item__error">
          <FontAwesomeIcon icon={ faTriangleExclamation } />
          <span>
            { error?.message }: <br />
            { errorToShow }
          </span>
        </div>
      </CSSTransition>

      { isKlineLoading
        ? <div className="pair-item__loading-state">
          <Loader size="lg" />
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
