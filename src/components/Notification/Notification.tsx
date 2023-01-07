import React, { FC } from 'react';
import './Notification.scss';
import { IBarNotification } from '../../models/notifications.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../hooks';
import { removeNotificationFromBar } from '../../store/features/notifications/notificationsSlice';

interface NotificationProps {
  notification: IBarNotification;
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
      { !!notification.icon &&
        <div className={ [
          'notification__icon',
          !!notification.color ? `notification__icon--${ notification.color }` : ''
        ].join(' ') }>
          <FontAwesomeIcon icon={ notification.icon } />
        </div> }

      <div className="notification__content">
        { !!notification.title && <b>{ notification.title }</b> }
        <span>{ notification.text }</span>
      </div>
    </div>
  );
};

export default Notification;
