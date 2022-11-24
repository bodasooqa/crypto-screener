import React, { useState } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';
import { Exchange } from '../../models/exchange.model';

const Home = () => {
  const [pairs] = useState([
    { exchange: Exchange.BINANCE, symbol: 'BTCUSDT' },
    { exchange: Exchange.BYBIT, symbol: 'BTCUSDT' },
  ]);

  return (
    <div className="home">
      <div className="container">
        <div className="home__content">
          <div className="home__pairs">
            { pairs.map(({ exchange, symbol }) =>
              <PairItem key={ `${ exchange }-${ symbol }` } exchange={ exchange } pair={ symbol } />
            ) }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
