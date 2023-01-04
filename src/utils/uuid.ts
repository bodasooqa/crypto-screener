import { INotification } from '../models/notifications.model';
import { v4 as uuid } from 'uuid';
import { ISettingsCollection } from '../models/settings.model';

export const generateNewUuidForNotification = (data: INotification[] = []): string => {
  const newUuid = uuid();

  if (data.some(notification => notification.id === newUuid)) {
    return generateNewUuidForNotification(data);
  } else {
    return newUuid;
  }
}

export const generateNewUuidForSettingsItem = (data: ISettingsCollection | null = null): string => {
  const newUuid = uuid();

  if (!data) {
    return newUuid;
  } else {
    if (Object.values(data).some(settingsItem => settingsItem.id === newUuid)) {
      return generateNewUuidForSettingsItem(data);
    } else {
      return newUuid;
    }
  }
}
