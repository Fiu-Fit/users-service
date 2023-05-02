// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import * as admin from 'firebase-admin';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey:            'AIzaSyDrazZyQNDhuOHPdPCnm-fSn0IjHhnHuBc',
  authDomain:        'fiufit-e9664.firebaseapp.com',
  projectId:         'fiufit-e9664',
  storageBucket:     'fiufit-e9664.appspot.com',
  messagingSenderId: '649565336432',
  appId:             '1:649565336432:web:b21a90d3814a7b9d3195b5',
  measurementId:     'G-0SBS847NRL',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
