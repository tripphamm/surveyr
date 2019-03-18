import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseui from 'firebaseui';

const config = {
  apiKey: 'AIzaSyD1Yyk72-U54xD2t9YqZT-q7OpBGU3-V3g',
  authDomain: 'survey-891.firebaseapp.com',
  databaseURL: 'https://survey-891.firebaseio.com',
  projectId: 'survey-891',
  storageBucket: 'survey-891.appspot.com',
  messagingSenderId: '1006850725025',
};

firebase.initializeApp(config);

if (firebase.firestore === undefined) {
  throw new Error('Firebase Firestore library was not loaded');
}

export const firestore = firebase.firestore();

if (firebase.auth === undefined) {
  throw new Error('Firebase Auth library was not loaded');
}

export const auth = firebase.auth();

export function getUIConfig() {
  const signInOptions = [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ];

  return {
    signInOptions,
    tosUrl: '/tos',
    privacyPolicyUrl: '/privacy',
  };
}

export const ui = new firebaseui.auth.AuthUI(firebase.auth());
