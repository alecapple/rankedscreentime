// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage"

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
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export const db = getFirestore(app);
export { GoogleAuthProvider, signInWithCredential, onAuthStateChanged };