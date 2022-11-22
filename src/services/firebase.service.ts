import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export class FirebaseService {
  public auth: Auth;
  public firestore: Firestore;

  constructor() {
    initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.firebaseapp.com`,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: `${ process.env.REACT_APP_FIREBASE_PROJECT_ID }.appspot.com`,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MSI,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    });

    this.auth = getAuth();
    this.firestore = getFirestore();
  }
}
