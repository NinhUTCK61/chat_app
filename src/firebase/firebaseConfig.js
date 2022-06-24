import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk8P4U6i022KAr4lzwMfcPUjB_Orh1tpA",
  authDomain: "chats-app-2b6bf.firebaseapp.com",
  projectId: "chats-app-2b6bf",
  storageBucket: "chats-app-2b6bf.appspot.com",
  messagingSenderId: "915442364023",
  appId: "1:915442364023:web:ac69dbd39932f0fc1f2072",
  measurementId: "G-131QVRSFQ7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}