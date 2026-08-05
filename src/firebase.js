// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqhuJwYtQedK3AY3lryqVs2zArthUEVC8",
  authDomain: "harvystin.firebaseapp.com",
  projectId: "harvystin",
  storageBucket: "harvystin.firebasestorage.app",
  messagingSenderId: "339800799408",
  appId: "1:339800799408:web:97059b6f8b56661deda375"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };