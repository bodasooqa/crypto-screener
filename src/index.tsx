import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { FirebaseService } from './services/firebase.service';
import { NetworkService } from './services/network.service';

interface GlobalContext {
  firebase: FirebaseService;
  network: NetworkService;
}

const contextDefaultValue: GlobalContext = {
  firebase: new FirebaseService(),
  network: new NetworkService(),
};

export const Context = createContext<GlobalContext>(contextDefaultValue);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Context.Provider value={ contextDefaultValue }>
    <App />
  </Context.Provider>
);
