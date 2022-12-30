import React, { FC } from 'react';
import './Notification.scss';
import { INotification } from '../../models/notification.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendDown, faArrowTrendUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toCapitalize } from '../../utils/format-string';
import { useAppDispatch } from '../../hooks';
import { removeNotificationFromBar } from '../../features/notifications/notificationsSlice';

interface NotificationProps {
  notification: INotification;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="notification">
      <button
        className="notification__close-btn"
        onClick={ () => dispatch(removeNotificationFromBar(notification.id)) }
      >
        <FontAwesomeIcon icon={ faXmark }></FontAwesomeIcon>
      </button>
      <div className={ [
        'notification__icon',
        notification.price > notification.momentPrice ? 'notification__icon--green' : '',
        notification.price < notification.momentPrice ? 'notification__icon--red' : ''
      ].join(' ') }>
        <FontAwesomeIcon icon={ notification.price > notification.momentPrice ? faArrowTrendUp : faArrowTrendDown } />
      </div>
      <div className="notification__content">
        <b>{ toCapitalize(notification.exchange) } — { notification.symbol }</b>
        <span>{ toCapitalize(notification.type) } { notification.price }</span>
      </div>
    </div>
  );
};

export default Notification;
