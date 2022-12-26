import { Exchange } from '../models/exchange.model';
import { useAppSelector } from './index';
import { INotification } from '../models/notification.model';
import { useMemo, useRef, useState } from 'react';

export const useNotifications = (pair: string, exchange: Exchange) => {
  const symbolKey = `${ exchange }-${ pair }`;

  const notifications = useAppSelector<INotification[]>((state) => {
    return (!!state.notifications.value && state.notifications.value[symbolKey]) || [];
  });

  const isLoading = useAppSelector((state) => state.notifications.isLoading);

  const [notificationsOpened, setNotificationsOpened] = useState(false);

  const notificationsOverlayRef = useRef(null);

  const notificationsCount = useMemo(() => {
    return (notifications || [])?.length || 0;
  }, [notifications]);

  const isNotificationsLoading = useMemo(() => {
    return isLoading.all || isLoading.pairs.includes(symbolKey);
  }, [isLoading]);

  return {
    notifications,
    notificationsOpened,
    notificationsCount,
    notificationsOverlayRef,
    isNotificationsLoading,
    setNotificationsOpened
  };
};
