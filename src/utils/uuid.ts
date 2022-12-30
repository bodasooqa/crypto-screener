import { INotification } from '../models/notification.model';
import { v4 as uuid } from 'uuid';

export const generateNewUuidForNotification = (data: INotification[] = []): string => {
  const newUuid = uuid();

  if (data.some(notification => notification.id === newUuid)) {
    return generateNewUuidForNotification(data);
  } else {
    return newUuid;
  }
}
