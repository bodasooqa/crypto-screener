import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IBarNotification,
  INewBarNotification,
  INotificationsCollection,
  INotificationsLoading
} from '../../../models/notifications.model';
import { addNotification, changeNotification, getNotifications, removeNotification } from './actionCreators';
import { generateUuid } from '../../../utils/uuid';

interface INotificationsState {
  value: INotificationsCollection | null;
  isLoading: INotificationsLoading;
  forBar: IBarNotification[];
}

const initialIsLoading: INotificationsLoading = {
  all: false,
  pairs: []
}

const initialState: INotificationsState = {
  value: null,
  isLoading: { ...initialIsLoading },
  forBar: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, { payload }: PayloadAction<INotificationsCollection | null>) => {
      state.value = payload;
    },

    addNotificationForBar: (state, { payload }: PayloadAction<INewBarNotification>) => {
      const newNotification: IBarNotification = {
        id: generateUuid(),
        ...payload
      }

      state.forBar.push(newNotification);
    },

    removeNotificationFromBar: (state, { payload }: PayloadAction<string>) => {
      const idx = state.forBar.findIndex(notification => notification.id === payload);
      state.forBar.splice(idx, 1);
    },

    removeAllNotificationsFromBar: (state) => {
      state.forBar = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addNotification.fulfilled, (state, { payload }) => {
      if (!!payload) {
        const key = `${ payload.exchange }-${ payload.symbol }`;

        if (!!state.value) {
          state.value[key]
            ? state.value[key].push(payload)
            : state.value[key] = [payload];
        } else {
          state.value = {
            [key]: [payload]
          };
        }
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

    builder.addCase(addNotification.rejected, (state, { payload }) => {
      console.log(payload);
      state.isLoading = { ...initialIsLoading, };
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

    builder.addCase(getNotifications.rejected, (state, { payload }) => {
      console.log(payload);
      state.isLoading = { ...initialIsLoading, };
    });

    builder.addCase(removeNotification.fulfilled, (state, { payload }) => {
      const key = `${ payload.exchange }-${ payload.symbol }`;

      if (!!payload && !!state.value) {
        const idx = state.value[key].findIndex(item => item.id === payload.id);
        state.value[key].splice(idx, 1);
      }

      state.isLoading = { ...initialIsLoading, };
    });

    builder.addCase(removeNotification.pending, (state, { meta }) => {
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

    builder.addCase(changeNotification.fulfilled, (state, { payload }) => {
      const itemPath = `${ payload.exchange }-${ payload.symbol }`;
      if (!!state.value && !!state.value[itemPath]?.length) {
        const idx = state.value[itemPath].findIndex(notification => notification.price === payload.price);
        state.value[itemPath][idx] = {
          ...state.value[itemPath][idx],
          ...payload
        }
      }
    });
  }
});

export const {
  addNotificationForBar,
  setNotifications,
  removeAllNotificationsFromBar,
  removeNotificationFromBar
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
