import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { NetworkService } from './services/network.service';
import { Provider } from 'react-redux';
import store from './store';

interface GlobalContext {
  network: NetworkService;
}

const contextDefaultValue: GlobalContext = {
  network: new NetworkService(),
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
