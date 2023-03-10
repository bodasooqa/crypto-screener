import React, { FC, useContext, useEffect, useMemo, useRef } from 'react';
import './PairItem.scss';
import { Context } from '../../index';
import { useFetching } from '../../hooks/useFetching';
import { useChart, useKlineData, useSocket } from './PartItem.hooks';
import { formatKline, updateKline } from '../../utils/kline';
import Loader from '../Loader/Loader';
import { Exchange } from '../../models/exchange.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBell, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import NotificationOverlay from '../NotificationOverlay/NotificationOverlay';
import SettingsOverlay from '../SettingsOverlay/SettingsOverlay';
import CardButton from '../UI/CardButton/CardButton';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { INewSettingsItem } from '../../models/settings.model';

interface PairItemProps {
  exchange: Exchange;
  pair: string;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ exchange, pair }) => {
  const { network } = useContext(Context);
  const [globalUser] = useAuth();

  const itemKey = `${ exchange }-${ pair }`;
  const chartId = `chart-${ itemKey }`;

  const errorRef = useRef(null);

  const [getKline, isKlineLoading, error] = useFetching(async () => {
    const { data } = await network[exchange].getKline(pair, newSettings.interval);
    const klineData = formatKline(data, exchange);
    setDayOpenPrice(Number(klineData[0].o));
    setKline(klineData);
  });

  const {
    settings,
    newSettings,
    settingsOpened,
    settingsButtonRef,
    settingsOverlayRef,
    isSettingsLoading,
    setSettingsOpened,
    setNewSettings,
    setSettingsChanged
  } = useSettings(pair, exchange);

  const {
    notifications,
    notificationsOpened,
    notificationsCount,
    notificationsOverlayRef,
    isNotificationsLoading,
    notificationsButtonRef,
    setNotificationsOpened,
    checkNotifications,
    checkAndNotify
  } = useNotifications(pair, exchange);

  const {
    actualPrice,
    actualColor,
    chartData,
    dayOpenPrice,
    candlesQty,
    percentDiff,
    percentColor,
    actualVolume,
    middleVolume,
    volumePercentDiff,
    setKline,
    setDayOpenPrice
  } = useKlineData(settings);

  const { chartInitiated, initChart, updateChart } = useChart();

  const { initSocket, closeConnection } = useSocket(
    pair, exchange, newSettings.interval,
    (candleData) => {
      setKline(oldKline => {
        const updatedKline = updateKline(oldKline, candleData);
        return [...updatedKline];
      });
    }
  );

  const errorToShow = useMemo(() => {
    return error?.response?.data.msg || error?.response?.data.retMsg || 'Exchange connection error';
  }, [error]);

  const initPair = async () => {
    await getKline();
  }

  const exchangeSplit = useMemo(() => {
    return exchange.split('-');
  }, [exchange]);

  const exchangeTitle = useMemo(() => {
    return exchangeSplit[0];
  }, [exchangeSplit]);

  const exchangeType = useMemo(() => {
    return exchangeSplit[1][0].toUpperCase();
  }, [exchangeSplit]);

  const onSettingsChanged = (editableSettings: INewSettingsItem) => {
    setNewSettings({
      ...newSettings,
      ...editableSettings
    });
    setSettingsChanged(true);
  };

  useEffect(() => {
    if (chartInitiated) {
      updateChart(chartData, dayOpenPrice);
    }
  }, [chartInitiated, chartData]);

  useEffect(() => {
    if (!globalUser) {
      setNotificationsOpened(false);
      setSettingsOpened(false);
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
    if (!isKlineLoading && !error) {
      initChart(chartId);
      initSocket();
    }
  }, [isKlineLoading]);

  useEffect(() => {
    initPair();
  }, [newSettings.interval]);

  useEffect(() => {
    if (!!settings) {
      setNewSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (!isSettingsLoading) {
      setSettingsOpened(false);
    }
  }, [isSettingsLoading]);

  useEffect(() => {
    return () => {
      closeConnection();
    }
  }, []);

  return (
    <div className="pair-item">
      <div className="pair-item__header">
        <div className="pair-item__header__text">
          <span className="pair-item__exchange">
            <span className='pair-item__exchange__type'>{ exchangeType }</span>
            { exchangeTitle.toUpperCase() } &#8226; { newSettings.interval }
          </span>
          <span className="pair-item__symbol">
            { pair }
            <span className={ ['pair-item__percent', `pair-item__percent--${ percentColor }`].join(' ') }>
              { percentDiff > 0 && '+' }
              { percentDiff.toFixed(2) }%
            </span>
          </span>
        </div>
        <div className={ [
          'pair-item__header__actions',
          notificationsOpened && !settingsOpened ? 'pair-item__header__actions--end' : '',
          settingsOpened ? 'pair-item__header__actions--active' : ''
        ].join(' ') }>
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
              isActive={ settingsOpened }
              onClick={ () => setSettingsOpened(!settingsOpened) }
            >
              { !!globalUser && !settingsOpened && isSettingsLoading
                ? <Loader size="xs" color="black" />
                : <FontAwesomeIcon icon={ faGear } size="sm" /> }
            </CardButton>
          </CSSTransition>

          <CSSTransition
            in={ !settingsOpened }
            nodeRef={ notificationsButtonRef }
            timeout={ 300 }
            classNames="fade"
            unmountOnExit
          >
            <CardButton
              ref={ notificationsButtonRef }
              disabled={ !globalUser }
              isActive={ notificationsOpened }
              badge={ notificationsCount }
              onClick={ () => setNotificationsOpened(!notificationsOpened) }
            >
              { !!globalUser && !notificationsOpened && isNotificationsLoading
                ? <Loader size="xs" color="black" />
                : <FontAwesomeIcon icon={ faBell } size="sm" /> }

            </CardButton>
          </CSSTransition>

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
        in={ settingsOpened }
        nodeRef={ settingsOverlayRef }
        timeout={ 500 }
        classNames="overlay-up"
        unmountOnExit
      >
        <SettingsOverlay
          ref={ settingsOverlayRef }
          exchange={ exchange }
          symbol={ pair }
          settings={ newSettings }
          isLoading={ isSettingsLoading }
          onSettingsChanged={ onSettingsChanged }
          maxAvgVolNumber={ candlesQty }
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
