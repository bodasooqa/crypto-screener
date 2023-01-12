import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './SettingsOverlay.scss';
import { Exchange } from '../../models/exchange.model';
import AppSelect from '../UI/AppSelect/AppSelect';
import AppInput from '../UI/AppInput/AppInput';
import { useSettings } from '../../hooks/useSettings';
import { INewSettingsItem } from '../../models/settings.model';
import AppButton from '../UI/AppButton/AppButton';
import Loader from '../Loader/Loader';
import { isEqual } from '../../utils/objects';
import { getUTCDayStart } from '../../utils/kline';
import { klineIntervalToNum, toNumberString } from '../../utils/format-string';
import { intervalOptions } from '../../utils/constants';
import { useAppDispatch } from '../../hooks';
import { removeSelectedSymbol } from '../../store/features/symbols/symbolsSlice';

interface SettingsOverlayProps {
  exchange: Exchange;
  isLoading: boolean;
  maxAvgVolNumber: number;
  symbol: string;
  settings: INewSettingsItem;
  onSettingsChanged: (settings: INewSettingsItem) => void;
}

const SettingsOverlay = React.forwardRef<HTMLDivElement, SettingsOverlayProps>((
  { symbol, exchange, isLoading, maxAvgVolNumber, settings, onSettingsChanged },
  ref
) => {
  const { initialSettings, remove } = useSettings(symbol, exchange);

  const [editableSettings, setEditableSettings] = useState(initialSettings);
  const [firstInit, setFirstInit] = useState(true);

  const isSettingsEqual = useMemo(() => {
    return isEqual(settings, editableSettings);
  }, [settings, editableSettings]);

  const isSubmitBtnDisabled = useMemo(() => {
    return isSettingsEqual || isLoading;
  }, [isSettingsEqual, isLoading]);

  const currentMaxAvgVolNumber = useMemo(() => {
    return Math.ceil((Date.now() - getUTCDayStart()) / (1000 * 60 * klineIntervalToNum(editableSettings.interval)))
      || 0;
  }, [editableSettings.interval]);

  const maxAvgVolNumberToShow = useMemo(() => {
    return settings.interval === editableSettings.interval
      ? maxAvgVolNumber
      : currentMaxAvgVolNumber;
  }, [maxAvgVolNumber, currentMaxAvgVolNumber, settings.interval, editableSettings.interval]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSettingsChanged(editableSettings);
  };

  const onFieldChanged = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, key: keyof INewSettingsItem) => {
    setEditableSettings({
      ...editableSettings,
      [key]: key === 'avgVolNumber'
        ? parseInt(toNumberString((event as ChangeEvent<HTMLInputElement>).target.value))
        : event.target.value
    })
  };

  useEffect(() => {
    setEditableSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!firstInit) {
      setEditableSettings({
        ...editableSettings,
        avgVolNumber: editableSettings.interval === settings.interval
          ? settings.avgVolNumber
          : null
      });
    } else {
      setFirstInit(false);
    }
  }, [editableSettings.interval]);

  return (
    <div className="settings-overlay" ref={ ref }>
      <div className="settings-overlay__header">
        <h4>Settings <b>{ symbol }</b></h4>
      </div>
      <div className="settings-overlay__content">
        <form
          className="settings-overlay__form"
          onSubmit={ onSubmit }
        >
          <div className="settings-overlay__form__row">
            <AppSelect
              label="Interval"
              placeholder="Interval"
              options={ intervalOptions }
              value={ editableSettings.interval }
              onChange={ (event) => onFieldChanged(event, 'interval') }
            />

            <AppInput
              label="Average Vol candles"
              placeholder={ `Max ${ maxAvgVolNumberToShow }` }
              mask={ { mask: '9', repeat: 3, showMaskOnHover: false, placeholder: '' } }
              max={ maxAvgVolNumberToShow }
              min={ 2 }
              name='avgVolNumber'
              type='text'
              value={ String(editableSettings.avgVolNumber) }
              onChange={ (event) => onFieldChanged(event, 'avgVolNumber') }
            />
          </div>

          <AppButton
            type="submit"
            disabled={ isSubmitBtnDisabled }
          >
            { isLoading
              ? <Loader size="sm" color="black" />
              : 'Save' }
          </AppButton>

          <AppButton color='red' onClick={ remove }>
            Remove
          </AppButton>
        </form>
      </div>
    </div>
  );
})

export default SettingsOverlay;
