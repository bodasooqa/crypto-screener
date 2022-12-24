import { createAsyncThunk } from '@reduxjs/toolkit';
import { INotification, INotificationsCollection, INotificationSet } from '../../models/notification.model';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { app, db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification: INotification, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        return new Promise<INotificationSet>(async resolve => {
          const itemPath = `${ notification.exchange }-${ notification.symbol }`;

          const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);
          const docSnap = await getDoc<INotificationsCollection>(userNotificationsRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            await setDoc(userNotificationsRef, {
              [itemPath]: !!data[itemPath]?.length
                ? [...data[itemPath], notification]
                : [notification]
            }, { merge: true });

            resolve({
              key: itemPath,
              notification
            });
          }
        });
      } else {
        thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (e) {
      console.log('e', e);
      thunkAPI.rejectWithValue('Error adding document:');
    }
  }
);

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    const { currentUser } = getAuth(app);

    if (!!currentUser) {
      try {
        return new Promise<INotificationsCollection>(async resolve => {
          const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);
          const docSnap = await getDoc<INotificationsCollection>(userNotificationsRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            resolve(data);
          }
        });
      } catch (e) {
        console.log(e)
        thunkAPI.rejectWithValue('Не удалось');
      }
    }
  }
)
