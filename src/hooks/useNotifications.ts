import { Exchange } from '../models/exchange.model';
import { useAppDispatch, useAppSelector } from './index';
import { INotification, NotificationWorkType } from '../models/notifications.model';
import { useMemo, useRef, useState } from 'react';
import alarmSound from '../assets/audio/alarm.mp3';
import { changeNotification, removeNotification } from '../store/features/notifications/actionCreators';
import { toCapitalize } from '../utils/format-string';
import { addNotificationForBar } from '../store/features/notifications/notificationsSlice';

export const useNotifications = (pair: string, exchange: Exchange) => {
  const symbolKey = `${ exchange }-${ pair }`;

  const dispatch = useAppDispatch();

  const notifications = useAppSelector<INotification[]>((state) => {
    return (!!state.notifications.value && state.notifications.value[symbolKey]) || [];
  });

  const { isLoading } = useAppSelector(state => state.notifications);

  const notificationsButtonRef = useRef(null);

  const [notificationsOpened, setNotificationsOpened] = useState(false);

  const notificationsOverlayRef = useRef(null);

  const notificationsCount = useMemo(() => {
    return (notifications || [])?.length || 0;
  }, [notifications]);

  const isNotificationsLoading = useMemo(() => {
    return isLoading.all || isLoading.pairs.includes(symbolKey);
  }, [isLoading]);

  const checkNotifications = (actualPrice: string) => {
    notifications.forEach(notification => {
      if (
        (notification.momentPrice > notification.price && Number(actualPrice) <= notification.price)
        || (notification.momentPrice < notification.price && Number(actualPrice) >= notification.price)
      ) {
        if (notification.workType === NotificationWorkType.ONCE) {
          dispatch(removeNotification(notification));
        } else {
          dispatch(changeNotification({
            notification,
            momentPrice: actualPrice
          }));
        }
      }
    });
  };

  const checkAndNotify = (actualPrice: string) => {
    notifications.forEach(notification => {
      if (
        (notification.momentPrice > notification.price && Number(actualPrice) <= notification.price)
        || (notification.momentPrice < notification.price && Number(actualPrice) >= notification.price)
      ) {
        dispatch(addNotificationForBar(notification));

        new Notification('BlackPortfolio', {
          body: `${ toCapitalize(exchange) } ${ pair } — ${ toCapitalize(notification.type) } ${ notification.price }`
        });

        const interval = setInterval(() => {
          new Audio(alarmSound).play();
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
        }, 5000);

        if (notification.workType === NotificationWorkType.ONCE) {
          dispatch(removeNotification(notification));
        } else {
          dispatch(changeNotification({
            notification,
            momentPrice: actualPrice
          }));
        }
      }
    });
  };

  return {
    notifications,
    notificationsOpened,
    notificationsCount,
    notificationsOverlayRef,
    isNotificationsLoading,
    notificationsButtonRef,
    setNotificationsOpened,
    checkNotifications,
    checkAndNotify
  };
};
