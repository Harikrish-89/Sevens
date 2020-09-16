import firebase from "firebase";

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDfELmdHDP7Q4uSX1Qw4EbPeluduSSWtTo",
  authDomain: "sevens-e08f5.firebaseapp.com",
  databaseURL: "https://sevens-e08f5.firebaseio.com",
  projectId: "sevens-e08f5",
  storageBucket: "sevens-e08f5.appspot.com",
  messagingSenderId: "414988138502",
  appId: "1:414988138502:web:86fa311fa7d9ef610beb87",
  measurementId: "G-RKG3NGSHQ0",
});

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const SESSION_PERSISTANCE = firebase.auth.Auth.Persistence.SESSION;

