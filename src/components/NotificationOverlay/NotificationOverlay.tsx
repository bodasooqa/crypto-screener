import React, { useMemo, useState } from 'react';
import './NotificationOverlay.scss';
import AppInput from '../UI/AppInput/AppInput';
import AppButton from '../UI/AppButton/AppButton';
import {
  INewNotification,
  INotification,
  NotificationType,
  NotificationWorkType
} from '../../models/notifications.model';
import { Exchange } from '../../models/exchange.model';
import { useAppDispatch } from '../../hooks';
import { addNotification, removeNotification } from '../../store/features/notifications/actionCreators';
import Loader from '../Loader/Loader';
import CardButton from '../UI/CardButton/CardButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationOverlayProps {
  exchange: Exchange;
  symbol: string;
  momentPrice: string;
}

const NotificationOverlay = React.forwardRef<HTMLDivElement, NotificationOverlayProps>((
  {
    symbol,
    exchange,
    momentPrice
  },
  ref
) => {
  const dispatch = useAppDispatch();

  const [price, setPrice] = useState('');

  const { notifications, isNotificationsLoading } = useNotifications(symbol, exchange);

  const floatMomentPrice = useMemo(() => {
    return parseFloat(momentPrice);
  }, [momentPrice]);

  const isButtonDisabled = useMemo(() => {
    return !price || isNotificationsLoading || String(parseFloat(price)) === String(floatMomentPrice);
  }, [price]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;
    setPrice(value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newNotification: INewNotification = {
      type: NotificationType.CROSS,
      workType: NotificationWorkType.ONCE,
      price: parseFloat(price),
      momentPrice: floatMomentPrice,
      symbol,
      exchange
    };

    setPrice('');

    dispatch(addNotification(newNotification));
  }

  const onRemove = (notification: INotification) => {
    dispatch(removeNotification(notification));
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
            type="number"
            placeholder={ `${ floatMomentPrice }` }
            preText="Cross"
            onChange={ handleChange }
          />

          <AppButton
            className={ [
              'notification-overlay__submit-btn',
              isNotificationsLoading ? 'notification-overlay__submit-btn--loading' : ''
            ] }
            type="submit"
            disabled={ isButtonDisabled }
          >
            { isNotificationsLoading
              ? <Loader size="sm" color="black" />
              : 'Add' }
          </AppButton>
        </form>
      </div>
      <div className="notification-overlay__content">
        { notifications.map((notification) =>
          <div
            className="notification-overlay__item"
            key={ `notification-${ notification.id }` }
          >
            <span className="notification-overlay__item__title">
              <b>{ notification.type } </b>
              ({ notification.workType })
            </span>
            <div className="notification-overlay__item__price">
              { notification.price }

              <CardButton onClick={ () => onRemove(notification) }>
                <FontAwesomeIcon icon={ faXmark } />
              </CardButton>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
})

export default NotificationOverlay;
