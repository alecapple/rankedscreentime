// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH2FO2z1nkyg1gatkpwCDL-G1uDR3tpsI",
  authDomain: "rankedscreentime.firebaseapp.com",
  projectId: "rankedscreentime",
  storageBucket: "rankedscreentime.firebasestorage.app",
  messagingSenderId: "409727082750",
  appId: "1:409727082750:web:bc6c5b3f07a46d3f2585af",
  measurementId: "G-CD1Z6590R4"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);