import { useAppDispatch, useAppSelector } from './index';
import { useContext, useMemo } from 'react';
import { Exchange, IExchangeSymbol, IExchangeWithSymbols } from '../models/exchange.model';
import { addSelectedSymbol } from '../store/features/symbols/symbolsSlice';
import { Context } from '../index';
import { StorageKeys } from '../models/storage.model';

export const useSymbols = () => {
  const { storage } = useContext(Context);
  const dispatch = useAppDispatch();
  const symbols = useAppSelector(state => state.symbols.value);

  const availableExchangesSymbols = useMemo<IExchangeWithSymbols[]>(() => {
    return Object.entries(symbols)
      .filter(([_, value]) => !!value?.length)
      .map(([key, value]) => ({
        title: key as Exchange,
        symbols: value
      }));
  }, [symbols]);

  const addSymbol = (item: IExchangeSymbol) => {
    dispatch(addSelectedSymbol(item));
    const selectedSymbols = storage.getCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, true);
    selectedSymbols.push(item);
    storage.setCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, selectedSymbols, true);
  }

  return { availableExchangesSymbols, addSymbol };
}
