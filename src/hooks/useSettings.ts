import { useEffect, useMemo, useRef, useState } from 'react';
import { Exchange, KlineInterval } from '../models/exchange.model';
import { ISelectOption, SelectData } from '../models/ui.model';
import { useAppDispatch, useAppSelector } from './index';
import { INewSettingsItem } from '../models/settings.model';
import { setSettingsItem } from '../store/features/settings/actionCreators';

export const useSettings = (pair: string, exchange: Exchange) => {
  const symbolKey = `${ exchange }-${ pair }`;

  const minutes: KlineInterval[] = ['5m', '15m', '30m'];
  const hours: KlineInterval[] = ['1h', '2h', '4h', '6h', '12h'];
  const days: KlineInterval[] = ['1d', '1w', '1M'];

  const initialSettings: INewSettingsItem = {
    exchange,
    symbol: pair,
    interval: '',
  }

  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector(state => state.settings);
  const settings = useAppSelector(state => {
    return (!!state.settings.value && state.settings.value[symbolKey]) || null;
  });

  const intervalOptions: SelectData<KlineInterval> = [
    {
      title: 'Minutes',
      options: minutes.map((value): ISelectOption<KlineInterval> => ({ value })),
    },
    {
      title: 'Hours',
      options: hours.map((value): ISelectOption<KlineInterval> => ({ value })),
    },
    {
      title: 'Days',
      options: days.map((value): ISelectOption<KlineInterval> => ({ value })),
    },
  ];

  const [settingsChanged, setSettingsChanged] = useState(false);
  const [interval, setSettingsInterval] = useState<KlineInterval>('5m');
  const [settingsOpened, setSettingsOpened] = useState(false);

  const settingsButtonRef = useRef(null);
  const settingsOverlayRef = useRef(null);

  const isSettingsLoading = useMemo(() => {
    return isLoading.all || isLoading.pairs.includes(symbolKey);
  }, [isLoading]);

  const updateSettings = () => {
    if (!!settings) {
      if (settings.interval !== interval) {
        dispatch(setSettingsItem({
          ...settings,
          interval,
        }));
      }
    } else {
      dispatch(setSettingsItem({
        ...initialSettings,
        interval,
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
    interval,
    intervalOptions,
    settingsOpened,
    settingsButtonRef,
    settingsOverlayRef,
    isSettingsLoading,
    settingsChanged,
    setSettingsOpened,
    setSettingsInterval,
    updateSettings,
    setSettingsChanged
  }
}
