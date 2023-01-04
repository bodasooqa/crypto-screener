import React, { FC, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import './NotificationsBar.scss';
import '../../styles/_animations.scss';
import { removeAllNotificationsFromBar } from '../../store/features/notifications/notificationsSlice';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Notification from '../Notification/Notification';

const NotificationsBar: FC = () => {
  const dispatch = useAppDispatch();
  const { forBar } = useAppSelector(state => state.notifications);

  const clearButtonRef = useRef();

  return (
    <TransitionGroup className='notifications-bar'>
      { forBar.map((notification) =>
        <CSSTransition
          key={ `notification-${ notification.id }` }
          timeout={ 300 }
          classNames="fade-up"
        >
          <Notification notification={ notification } />
        </CSSTransition>
      ) }

      { !!forBar.length &&
        <CSSTransition
          nodeRef={ clearButtonRef }
          timeout={ 300 }
          classNames="fade-up"
        >
          <button
            className="notifications-bar__item notifications-bar__item--button"
            onClick={ () => dispatch(removeAllNotificationsFromBar()) }
          >
            Clear all
          </button>
        </CSSTransition>
      }
    </TransitionGroup>
  );
};

export default NotificationsBar;
