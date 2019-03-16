import app from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';

const config = {
  apiKey: 'AIzaSyD1Yyk72-U54xD2t9YqZT-q7OpBGU3-V3g',
  authDomain: 'survey-891.firebaseapp.com',
  databaseURL: 'https://survey-891.firebaseio.com',
  projectId: 'survey-891',
  storageBucket: 'survey-891.appspot.com',
  messagingSenderId: '1006850725025',
};

app.initializeApp(config);

const firestoreSettings = {
  timestampsInSnapshots: true,
};

if (app.firestore === undefined) {
  throw new Error('Firebase Firestore library was not loaded');
}

export const firestore = app.firestore();
firestore.settings(firestoreSettings);

if (app.auth === undefined) {
  throw new Error('Firebase Auth library was not loaded');
}

export const auth = app.auth();
