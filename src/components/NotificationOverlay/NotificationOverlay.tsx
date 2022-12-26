import React, { useEffect, useMemo, useState } from 'react';
import './NotificationOverlay.scss';
import AppInput from '../UI/AppInput/AppInput';
import AppButton from '../UI/AppButton/AppButton';
import { INotification, NotificationType, NotificationWorkType } from '../../models/notification.model';
import { Exchange } from '../../models/exchange.model';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addNotification, removeNotification } from '../../features/notifications/actionCreators';
import Loader from '../Loader/Loader';
import CardButton from '../UI/CardButton/CardButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface NotificationOverlayProps {
  exchange: Exchange;
  symbol: string;
  momentPrice: string;
}

const NotificationOverlay = React.forwardRef<HTMLDivElement, NotificationOverlayProps>((
  {
    symbol, exchange, momentPrice
  }, ref
) => {
  const symbolKey = `${ exchange }-${ symbol }`;

  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => !!state.notifications.value && state.notifications.value[symbolKey]) || [];
  const isLoading = useAppSelector(state => state.notifications.isLoading);

  const [price, setPrice] = useState('');

  const isNotificationsLoading = useMemo(() => {
    return isLoading.all || isLoading.pairs.includes(symbolKey);
  }, [isLoading]);

  const isButtonDisabled = useMemo(() => {
    return !price || isNotificationsLoading;
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
      momentPrice: Number(momentPrice),
      symbol,
      exchange
    };

    setPrice('');

    dispatch(addNotification(newNotification));
  }

  const setMomentPrice = () => {
    setPrice(String(Number(momentPrice)));
  }

  const onRemove = (notification: INotification) => {
    dispatch(removeNotification(notification));
  }

  useEffect(() => {
    if (!isNotificationsLoading) {
      setMomentPrice();
    }
  }, [isNotificationsLoading]);

  useEffect(() => {
    setMomentPrice();
  }, []);

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
            placeholder="Price"
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
        { notifications.map((notification, idx) =>
          <div
            className="notification-overlay__item"
            key={ `notification-${ idx }` }
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
