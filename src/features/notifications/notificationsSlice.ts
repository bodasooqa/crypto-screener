import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '../../models/notification.model';
import { sendNotification } from './actionCreators';

interface INotificationsState {
  value: INotification[]
}

const initialState: INotificationsState = {
  value: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.value = action.payload;
    },
  },
  extraReducers: {
    [sendNotification.fulfilled.type]: (state, action: PayloadAction<INotification>) => {
      state.value.push(action.payload);
    },
    [sendNotification.rejected.type]: (_, action: PayloadAction<string>) => {
      console.log(action.payload);
    }
  }
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
