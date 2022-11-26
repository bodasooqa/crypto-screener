import React, { useState } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';
import { Exchange, KlineInterval } from '../../models/exchange.model';

const Home = () => {
  const [pairs] = useState([
    { exchange: Exchange.BINANCE, symbol: 'BTCUSDT', interval: '1h' as KlineInterval },
    { exchange: Exchange.BYBIT, symbol: 'BTCUSDT', interval: '1h' as KlineInterval },
  ]);

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
