import { useEffect, useMemo, useRef, useState } from 'react';
import { Exchange } from '../models/exchange.model';
import { useAppDispatch, useAppSelector } from './index';
import { INewSettingsItem } from '../models/settings.model';
import { setSettingsItem } from '../store/features/settings/actionCreators';

export const useSettings = (pair: string, exchange: Exchange) => {
  const symbolKey = `${ exchange }-${ pair }`;

  const initialSettings: INewSettingsItem = {
    avgVolNumber: null,
    exchange,
    interval: '5m',
    symbol: pair,
  }

  const dispatch = useAppDispatch();

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
        return dispatch(setSettingsItem({
          ...settings,
          ...newSettings,
        }));
      }
    } else {
      return dispatch(setSettingsItem({
        ...initialSettings,
        ...newSettings,
      }));
    }
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
    setSettingsChanged
  }
}
