import React, { FC, useContext, useEffect } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { useChart, useKlineData, useSettings, useSocket } from './PartItem.hooks';
import { formatKline, updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';
import { Exchange, KlineInterval } from '../../models/exchange.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import NotificationOverlay from '../NotificationOverlay/NotificationOverlay';
import CardButton from '../UI/CardButton/CardButton';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { NotificationWorkType } from '../../models/notification.model';
import { useAppDispatch } from '../../hooks';
import { removeNotification } from '../../features/notifications/actionCreators';
import alarmSound from '../../assets/audio/alarm.mp3';

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

  const dispatch = useAppDispatch();

  const chartId = `chart-${ exchange }-${ pair }`;

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
    setNotificationsOpened
  } = useNotifications(pair, exchange);
  const { settingsButtonRef } = useSettings();

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
    notifications.forEach((notification) => {
      if (
        (notification.momentPrice > notification.price && Number(actualPrice) <= notification.price)
        || (notification.momentPrice < notification.price && Number(actualPrice) >= notification.price)
      ) {
        const toCapitalize = (str: string) => {
          return `${ str[0].toUpperCase() }${ str.substring(1) }`
        }

        new Notification('BlackPortfolio', {
          body: `${ toCapitalize(exchange) } ${ pair } — ${ toCapitalize(notification.type) } ${ notification.price }`
        });

        const interval = setInterval(() => {
          new Audio(alarmSound).play();
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
        }, 5000);

        if (notification.workType === NotificationWorkType.ONCE) {
          dispatch(removeNotification(notification));
        }
      }
    });
  }, [actualPrice]);

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
              ? <Loader size='xs' color='black' />
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

      { isKlineLoading
        ? <div className="pair-item__loading-state">
          <Loader size='lg' />
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
