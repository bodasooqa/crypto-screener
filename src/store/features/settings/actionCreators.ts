import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app, db } from '../../../config/firebase';
import { getAuth } from 'firebase/auth';
import { generateNewUuidForSettingsItem } from '../../../utils/uuid';
import { INewSettingsItem, ISettingsCollection, ISettingsItem } from '../../../models/settings.model';
import { addNotificationForBar } from '../notifications/notificationsSlice';
import { toCapitalize } from '../../../utils/format-string';

export const setSettingsItem = createAsyncThunk(
  'settings/setSettingsItem',
  async (settingsItem: INewSettingsItem | ISettingsItem, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const itemPath = `${ settingsItem.exchange }-${ settingsItem.symbol }`;

        const userSettingsRef = doc(db, `settings/${ currentUser.uid }`);
        const docSnap = await getDoc<ISettingsCollection>(userSettingsRef);

        const notify = () => {
          thunkAPI.dispatch(addNotificationForBar({
            title: `Settings — ${ toCapitalize(settingsItem.exchange) } ${ settingsItem.symbol }`,
            text: 'Changes saved successfully'
          }));
        }

        const createDoc = async (data: ISettingsCollection | null = null) => {
          const newSettingsItem: ISettingsItem = {
            ...settingsItem,
            id: generateNewUuidForSettingsItem(data),
          };

          await setDoc<ISettingsCollection>(userSettingsRef, {
            [itemPath]: newSettingsItem,
          }, { merge: true });

          notify();

          return thunkAPI.fulfillWithValue(newSettingsItem);
        }

        if ('id' in settingsItem) {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (!!data[itemPath] && data[itemPath].id === settingsItem.id) {
              await updateDoc<ISettingsCollection>(userSettingsRef, {
                [itemPath]: settingsItem,
              });

              notify();

              return thunkAPI.fulfillWithValue(settingsItem);
            } else {
              return await createDoc(data);
            }
          } else {
            return await createDoc();
          }
        } else {
          return await createDoc();
        }
      } else {
        return thunkAPI.rejectWithValue('Unauthorized');
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(`Error adding document: ${ err }`);
    }
  }
);

export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async (_, thunkAPI) => {
    try {
      const { currentUser } = getAuth(app);

      if (!!currentUser) {
        const userSettingsRef = doc(db, `settings/${ currentUser.uid }`);
        const docSnap = await getDoc<ISettingsCollection>(userSettingsRef);

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
);
