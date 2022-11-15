import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSI,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});

interface GlobalContext {
  auth: Auth;
  firestore: Firestore;
}

const auth = getAuth();
const firestore = getFirestore();

const contextDefaultValue = {
  auth,
  firestore
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
