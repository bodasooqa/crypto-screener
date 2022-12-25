import React, { useEffect, useState } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';
import { Exchange, KlineInterval } from '../../models/exchange.model';
import { useAppDispatch } from '../../hooks';
import { getNotifications } from '../../features/notifications/actionCreators';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { setNotifications } from '../../features/notifications/notificationsSlice';

const Home = () => {
  const [globalUser] = useAuthState(auth);

  const dispatch = useAppDispatch();

  const [pairs] = useState([
    { exchange: Exchange.BINANCE, symbol: 'BTCUSDT', interval: '15m' as KlineInterval },
    { exchange: Exchange.BINANCE, symbol: 'ETHUSDT', interval: '15m' as KlineInterval },
    { exchange: Exchange.BINANCE, symbol: 'SOLUSDT', interval: '15m' as KlineInterval },
    { exchange: Exchange.BINANCE, symbol: 'ADAUSDT', interval: '15m' as KlineInterval },
    { exchange: Exchange.BINANCE, symbol: 'ATOMUSDT', interval: '15m' as KlineInterval },
    { exchange: Exchange.BINANCE, symbol: 'XRPUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'BTCUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'ETHUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'SOLUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'ADAUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'ATOMUSDT', interval: '15m' as KlineInterval },
    // { exchange: Exchange.BYBIT, symbol: 'XRPUSDT', interval: '15m' as KlineInterval },
  ]);

  useEffect(() => {
    if (!!globalUser) {
      dispatch(getNotifications());
    } else {
      dispatch(setNotifications(null));
    }
  }, [globalUser]);

  return (
    <div className="home">
      <div className="container">
        <div className="home__content">
          <div className="home__pairs">
            { pairs.map(({ exchange, symbol, interval }) =>
              <PairItem
                key={ `${ exchange }-${ symbol }` }
                exchange={ exchange }
                pair={ symbol }
                interval={ interval }
              />
            ) }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
