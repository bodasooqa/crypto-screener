import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotificationsCollection, INotificationsLoading } from '../../models/notification.model';
import { addNotification, getNotifications } from './actionCreators';

interface INotificationsState {
  value: INotificationsCollection;
  isLoading: INotificationsLoading;
}

const initialIsLoading: INotificationsLoading = {
  all: false,
  pairs: []
}

const initialState: INotificationsState = {
  value: {},
  isLoading: { ...initialIsLoading }
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotificationsCollection>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNotification.fulfilled, (state, { payload }) => {
      if (!!payload) {
        state.value[payload.key]
          ? state.value[payload.key].push(payload.notification)
          : state.value[payload.key] = [payload.notification];
      }

      state.isLoading = { ...initialIsLoading };
    });

    builder.addCase(addNotification.pending, (state, { meta }) => {
      if (!!meta) {
        state.isLoading = {
          ...initialIsLoading,
          pairs: [
            ...state.isLoading.pairs,
            `${ meta.arg.exchange }-${ meta.arg.symbol }`
          ]
        }
      }
    });

    builder.addCase(addNotification.rejected, (_, { payload }) => {
      console.log(payload);
    });

    builder.addCase(getNotifications.fulfilled, (state, { payload }) => {
      if (!!payload) {
        state.value = payload;
      }

      state.isLoading = { ...initialIsLoading };
    });

    builder.addCase(getNotifications.pending, (state) => {
      state.isLoading = {
        ...initialIsLoading,
        all: true
      };
    });
  }
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
