import { createAsyncThunk } from '@reduxjs/toolkit';
import { INotification } from '../../models/notification.model';

export const sendNotification = createAsyncThunk('notifications/sendNotification', async (notification: INotification, thunkAPI) => {
  try {
    return await new Promise<INotification>(resolve => {
      setTimeout(() => {
        resolve(notification);
      }, 3000);
    });
  } catch (e) {
    thunkAPI.rejectWithValue('Не удалось :(');
  }
});
