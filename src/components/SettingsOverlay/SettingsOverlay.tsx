import React, { ChangeEvent } from 'react';
import './SettingsOverlay.scss';
import { Exchange, KlineInterval } from '../../models/exchange.model';
import AppSelect from '../UI/AppSelect/AppSelect';
import { useSettings } from '../../hooks/useSettings';

interface SettingsOverlayProps {
  exchange: Exchange;
  symbol: string;
  interval: KlineInterval;
  onIntervalSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SettingsOverlay = React.forwardRef<HTMLDivElement, SettingsOverlayProps>((
  { symbol, exchange, interval, onIntervalSelect },
  ref
) => {
  const { intervalOptions } = useSettings(symbol, exchange);

  return (
    <div className="settings-overlay" ref={ ref }>
      <div className="settings-overlay__header">
        <h4>Settings <b>{ symbol }</b></h4>

      </div>
      <div className="settings-overlay__content">
        <form
          className="settings-overlay__content__form"
        >
          <AppSelect
            label="Interval"
            placeholder='Interval'
            options={ intervalOptions }
            value={ interval }
            onChange={ onIntervalSelect }
          />
        </form>
      </div>
    </div>
  );
})

export default SettingsOverlay;
