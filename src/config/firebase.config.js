import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyATKN-WqknRktRidktxcTHculm7zb7Q-Mk",
  authDomain: "crisanger-14296.firebaseapp.com",
  databaseURL: "https://crisanger-14296.firebaseio.com",
  projectId: "crisanger-14296",
  storageBucket: "crisanger-14296.appspot.com",
  messagingSenderId: "339722507493",
  appId: "1:339722507493:web:28a031e5b66c5866a0f00c"
})
export const { auth, firestore, storage } = firebase;