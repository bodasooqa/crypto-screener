import React, { FC, useContext, useEffect } from 'react';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import AppRouter from './AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { Context } from './index';
import { StorageKeys } from './models/storage.model';
import { Exchange, IExchangeSymbol } from './models/exchange.model';
import { useAppDispatch } from './hooks';
import { setSelectedSymbols } from './store/features/symbols/symbolsSlice';

const App: FC = () => {
  const { storage } = useContext(Context);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const selectedSymbols = storage.getCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, true);

    if (!!selectedSymbols) {
      dispatch(setSelectedSymbols(selectedSymbols));
    } else {
      const initialSelectedSymbols = [
        { exchange: Exchange.BINANCE_SPOT, symbol: 'BTCUSDT' },
        { exchange: Exchange.BINANCE_SPOT, symbol: 'ETHUSDT' },
        // { exchange: Exchange.BINANCE_SPOT, symbol: 'SOLUSDT' },
        // { exchange: Exchange.BINANCE_SPOT, symbol: 'ADAUSDT' },
        // { exchange: Exchange.BINANCE_SPOT, symbol: 'ATOMUSDT' },
        // { exchange: Exchange.BINANCE_SPOT, symbol: 'XRPUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'BTCUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'ETHUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'SOLUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'ADAUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'ATOMUSDT' },
        // { exchange: Exchange.BYBIT_SPOT, symbol: 'XRPUSDT' },
      ];

      storage.setCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, initialSelectedSymbols, true);
      dispatch(setSelectedSymbols(initialSelectedSymbols));
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
