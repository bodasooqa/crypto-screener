import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { NetworkService } from './services/network.service';
import { Provider } from 'react-redux';
import store from './store';
import { StorageService } from './services/storage.service';
import { GlobalContext } from './models/app.model';

const contextDefaultValue: GlobalContext = {
  network: NetworkService.shared,
  storage: StorageService.shared,
};

export const Context = createContext<GlobalContext>(contextDefaultValue);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Context.Provider value={ contextDefaultValue }>
    <Provider store={ store }>
      <App />
    </Provider>
  </Context.Provider>
);
