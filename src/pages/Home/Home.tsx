import React, { useState } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';

const Home = () => {
  const [pairs] = useState(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT']);

  return (
    <div className='home'>
      <div className="container">
        <div className="home__content">
          Home
          <div className="home__pairs">
            {pairs.map(pair =>
              <PairItem key={pair} pair={pair} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
