import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSI,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = !!getApps()?.length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
