import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  INewNotification,
  INotification,
  INotificationsCollection,
  INotificationSet
} from '../../models/notification.model';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app, db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { requestPermission } from '../../utils/notifications';
import { generateNewUuidForNotification } from '../../utils/uuid';

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification: INewNotification, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const itemPath = `${ notification.exchange }-${ notification.symbol }`;

        const newNotification: INotification = {
          ...notification,
          id: generateNewUuidForNotification()
        }

        const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);
        const docSnap = await getDoc<INotificationsCollection>(userNotificationsRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!!data[itemPath]?.length) {
            await updateDoc(userNotificationsRef, {
              [itemPath]: arrayUnion({
                ...newNotification,
                id: generateNewUuidForNotification(data[itemPath])
              })
            });
          } else {
            await setDoc(userNotificationsRef, {
              [itemPath]: [newNotification]
            }, { merge: true });
          }
        } else {
          await setDoc(userNotificationsRef, {
            [itemPath]: [newNotification]
          });
        }

        await requestPermission();

        return thunkAPI.fulfillWithValue(newNotification);
      } else {
        return thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(`Error adding document: ${ err }`);
    }
  }
);

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);
        const docSnap = await getDoc<INotificationsCollection>(userNotificationsRef);

        if (docSnap.exists()) {
          await requestPermission();

          const data = docSnap.data();
          return thunkAPI.fulfillWithValue(data);
        } else {
          return thunkAPI.rejectWithValue('No data');
        }
      } else {
        return thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(`Error getting documents: ${ err }`);
    }
  }
);

export const removeNotification = createAsyncThunk(
  'notifications/removeNotification',
  async (notification: INotification, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);
        await updateDoc(userNotificationsRef, {
          [`${ notification.exchange }-${ notification.symbol }`]: arrayRemove(notification)
        });

        return thunkAPI.fulfillWithValue(notification);
      } else {
        return thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(`Error getting documents: ${ err }`);
    }
  }
);

export const changeNotification = createAsyncThunk(
  'notifications/changeNotification',
  async ({ notification, momentPrice }: INotificationSet, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const itemPath = `${ notification.exchange }-${ notification.symbol }`;
        const changedNotification: INotification = {
          ...notification,
          momentPrice: parseFloat(momentPrice)
        };

        const userNotificationsRef = doc(db, `notifications/${ currentUser.uid }`);

        await updateDoc(userNotificationsRef, {
          [itemPath]: arrayRemove(notification)
        });

        await updateDoc(userNotificationsRef, {
          [itemPath]: arrayUnion(changedNotification)
        });

        return thunkAPI.fulfillWithValue(changedNotification);
      } else {
        return thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(`Error getting documents: ${ err }`);
    }
  }
);
