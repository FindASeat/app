import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB4oJ-SW_RHHEX-gD1JZn9HkuQh6vRuX1c',
  authDomain: 'findaseat-df069.firebaseapp.com',
  databaseURL: 'https://findaseat-df069-default-rtdb.firebaseio.com',
  projectId: 'findaseat-df069',
  storageBucket: 'findaseat-df069.appspot.com',
  messagingSenderId: '623778785791',
  appId: '1:623778785791:web:96ca3e36be12700ef95fca',
  measurementId: 'G-0BD2VDSSFX',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
