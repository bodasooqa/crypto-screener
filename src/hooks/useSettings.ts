import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Exchange, IExchangeSymbol } from '../models/exchange.model';
import { useAppDispatch, useAppSelector } from './index';
import { INewSettingsItem } from '../models/settings.model';
import { setSettingsItem } from '../store/features/settings/actionCreators';
import { removeSelectedSymbol } from '../store/features/symbols/symbolsSlice';
import { Context } from '../index';
import { StorageKeys } from '../models/storage.model';

export const useSettings = (symbol: string, exchange: Exchange) => {
  const symbolKey = `${ exchange }-${ symbol }`;

  const initialSettings: INewSettingsItem = {
    avgVolNumber: null,
    exchange,
    interval: '5m',
    symbol,
  }

  const dispatch = useAppDispatch();

  const { storage } = useContext(Context);

  const { isLoading } = useAppSelector(state => state.settings);
  const storedSettings = useAppSelector(({ settings }) => settings);

  const [settingsChanged, setSettingsChanged] = useState(false);
  const [newSettings, setNewSettings] = useState<INewSettingsItem>(initialSettings);
  const [settingsOpened, setSettingsOpened] = useState(false);

  const settingsButtonRef = useRef(null);
  const settingsOverlayRef = useRef(null);

  const settings = useMemo(() => {
    return (!!storedSettings.value && storedSettings.value[symbolKey]) || null;
  }, [storedSettings]);

  const isSettingsLoading = useMemo(() => {
    return isLoading.all || isLoading.pairs.includes(symbolKey);
  }, [isLoading]);

  const updateSettings = () => {
    if (!!settings) {
      if (JSON.stringify(settings) !== JSON.stringify(newSettings)) {
        dispatch(setSettingsItem({
          ...settings,
          ...newSettings,
        }));
      }
    } else {
      dispatch(setSettingsItem({
        ...initialSettings,
        ...newSettings,
      }));
    }
  };

  const remove = () => {
    const selectedSymbols = storage.getCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, true);
    const idx = selectedSymbols.findIndex((item) => item.symbol === symbol && item.exchange === exchange);
    selectedSymbols.splice(idx, 1);
    storage.setCookie<IExchangeSymbol[]>(StorageKeys.SELECTED_SYMBOLS, selectedSymbols, true);
    dispatch(removeSelectedSymbol({ symbol, exchange }));
  };

  useEffect(() => {
    if (settingsChanged) {
      updateSettings();
      setSettingsChanged(false);
    }
  }, [settingsChanged]);

  return {
    settings,
    newSettings,
    settingsOpened,
    settingsButtonRef,
    settingsOverlayRef,
    isSettingsLoading,
    settingsChanged,
    initialSettings,
    setSettingsOpened,
    setNewSettings,
    updateSettings,
    setSettingsChanged,
    remove
  }
}
