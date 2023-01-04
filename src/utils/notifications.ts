export const requestNotificationsPermission = async (): Promise<void> => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    await Notification.requestPermission();
  }
}
