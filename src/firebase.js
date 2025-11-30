import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGc9tArC4b8bE7NZq3g23XcZds8anAFAg",
  authDomain: "questionpaper-3ae4a.firebaseapp.com",
  projectId: "questionpaper-3ae4a",
  storageBucket: "questionpaper-3ae4a.firebasestorage.app",
  messagingSenderId: "277501791300",
  appId: "1:277501791300:web:35b5e4f81cfdba9d82c011",
  measurementId: "G-XHE5GQD1ZD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
