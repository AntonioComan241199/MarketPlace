// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marketplace-b9455.firebaseapp.com",
  projectId: "marketplace-b9455",
  storageBucket: "marketplace-b9455.appspot.com",
  messagingSenderId: "213487595191",
  appId: "1:213487595191:web:a9de9d80a18e859d63a732"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);