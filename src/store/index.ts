import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './features/notifications/notificationsSlice';
import settingsReducer from './features/settings/settingsSlice';
import symbolsReducer from './features/symbols/symbolsSlice';
import { NetworkService } from '../services/network.service';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    settings: settingsReducer,
    symbols: symbolsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        network: NetworkService.shared
      }
    }
  })
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
