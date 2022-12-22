import React from 'react';
import './NotificationOverlay.scss';

interface NotificationOverlayProps {}

const NotificationOverlay = React.forwardRef<HTMLDivElement, NotificationOverlayProps>((_, ref) => {
  return (
    <div className="notification-overlay" ref={ ref }>
      <span>Notifications</span>
    </div>
  );
})

export default NotificationOverlay;
