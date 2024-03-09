require("dotenv").config();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
  authDomain: "silent-scanner-416518.firebaseapp.com",
  projectId: "silent-scanner-416518",
  storageBucket: "silent-scanner-416518.appspot.com",
  messagingSenderId: "251364493327",
  appId: "1:251364493327:web:04adc8aaeec28552cd3b7a",
  measurementId: "G-K77PTM990J"
};

const app = initializeApp(firebaseConfig);