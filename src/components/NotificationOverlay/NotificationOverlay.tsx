import React, { useMemo, useState } from 'react';
import './NotificationOverlay.scss';
import AppInput from '../UI/AppInput/AppInput';
import AppButton from '../UI/AppButton/AppButton';
import { INotification, NotificationType, NotificationWorkType } from '../../models/notification.model';
import { Exchange } from '../../models/exchange.model';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendNotification } from '../../features/notifications/actionCreators';

interface NotificationOverlayProps {
  exchange: Exchange;
  symbol: string;
}

const NotificationOverlay = React.forwardRef<HTMLDivElement, NotificationOverlayProps>(({ symbol, exchange }, ref) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.value);

  const [price, setPrice] = useState('');

  const isButtonDisabled = useMemo(() => {
    return !price;
  }, [price]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;
    setPrice(value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newNotification: INotification = {
      type: NotificationType.CROSS,
      workType: NotificationWorkType.ONCE,
      price: Number(price),
      symbol,
      exchange
    };

    dispatch(sendNotification(newNotification));
  }

  return (
    <div className="notification-overlay" ref={ ref }>
      <div className="notification-overlay__header">
        <h4>Notifications <b>{ symbol }</b></h4>

        <form
          className="notification-overlay__header__form"
          onSubmit={ handleSubmit }
        >
          <AppInput
            value={ price }
            type='number'
            placeholder='Price'
            preText='Cross'
            onChange={ handleChange }
          />

          <AppButton type='submit' disabled={ isButtonDisabled }>Add</AppButton>
        </form>
      </div>
      <div className="notification-overlay__content">
        { notifications.map((notification, idx) =>
          <div
            className='notification-overlay__item'
            key={ `notification-${idx}` }
          >
            <span className='notification-overlay__item__title'>
              <b>{ notification.type } </b>
              ({ notification.workType })
            </span>
            <div className='notification-overlay__item__price'>
              { notification.price }
            </div>
          </div>
        ) }
      </div>
    </div>
  );
})

export default NotificationOverlay;
