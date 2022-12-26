export const requestPermission = async (): Promise<void> => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    await Notification.requestPermission();
  }
}
