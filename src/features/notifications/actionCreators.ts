import { createAsyncThunk } from '@reduxjs/toolkit';
import { INotification, INotificationsCollection } from '../../models/notification.model';
import { arrayRemove, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app, db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification: INotification, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
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
        } else {
          await setDoc(userNotificationsRef, {
            [itemPath]: [notification]
          });
        }

        return thunkAPI.fulfillWithValue(notification);
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
)

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
)
