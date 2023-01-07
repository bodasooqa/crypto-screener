import React, { useEffect, useState } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';
import { Exchange } from '../../models/exchange.model';
import { useAppDispatch } from '../../hooks';
import { getNotifications } from '../../store/features/notifications/actionCreators';
import { setNotifications } from '../../store/features/notifications/notificationsSlice';
import { useAuth } from '../../hooks/useAuth';
import { getSettings } from '../../store/features/settings/actionCreators';
import { setSettings } from '../../store/features/settings/settingsSlice';

const Home = () => {
  const [globalUser] = useAuth();

  const dispatch = useAppDispatch();

  const [pairs] = useState([
    { exchange: Exchange.BINANCE, symbol: 'BTCUSDT' },
    { exchange: Exchange.BINANCE, symbol: 'ETHUSDT' },
    { exchange: Exchange.BINANCE, symbol: 'SOLUSDT' },
    { exchange: Exchange.BINANCE, symbol: 'ADAUSDT' },
    { exchange: Exchange.BINANCE, symbol: 'ATOMUSDT' },
    { exchange: Exchange.BINANCE, symbol: 'XRPUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'BTCUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'ETHUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'SOLUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'ADAUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'ATOMUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'XRPUSDT' },
  ]);

  useEffect(() => {
    if (!!globalUser) {
      dispatch(getNotifications());
      dispatch(getSettings());
    } else {
      dispatch(setNotifications(null));
      dispatch(setSettings(null));
    }
  }, [globalUser]);

  return (
    <div className="home">
      <div className="container">
        <div className="home__content">
          <div className="home__pairs">
            { pairs.map(({ exchange, symbol }) =>
              <PairItem
                key={ `${ exchange }-${ symbol }` }
                exchange={ exchange }
                pair={ symbol }
              />
            ) }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
