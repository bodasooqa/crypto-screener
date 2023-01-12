import React, { useEffect } from 'react';
import './Home.scss';
import PairItem from '../../components/PairItem/PairItem';
import AddSymbol from '../../components/AddSymbol/AddSymbol';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getNotifications } from '../../store/features/notifications/actionCreators';
import { setNotifications } from '../../store/features/notifications/notificationsSlice';
import { useAuth } from '../../hooks/useAuth';
import { getSettings } from '../../store/features/settings/actionCreators';
import { setSettings } from '../../store/features/settings/settingsSlice';
import { getBinanceSpotSymbols } from '../../store/features/symbols/actionCreators';

const Home = () => {
  const [globalUser] = useAuth();

  const dispatch = useAppDispatch();

  const pairs = useAppSelector(state => state.symbols.selectedSymbols);

  useEffect(() => {
    if (!!globalUser) {
      dispatch(getNotifications());
      dispatch(getSettings());
    } else {
      dispatch(setNotifications(null));
      dispatch(setSettings(null));
    }
  }, [globalUser]);

  useEffect(() => {
    dispatch(getBinanceSpotSymbols());
  }, []);

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
            <AddSymbol />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
