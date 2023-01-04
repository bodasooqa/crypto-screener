import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './features/notifications/notificationsSlice';
import settingsReducer from './features/settings/settingsSlice';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    settings: settingsReducer,
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
