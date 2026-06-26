import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8ScwH9TOOIP0Td9DSiJigeGojB7KAODE",
  authDomain: "tasbeehly-baf66.firebaseapp.com",
  projectId: "tasbeehly-baf66",
  storageBucket: "tasbeehly-baf66.firebasestorage.app",
  messagingSenderId: "207821527708",
  appId: "1:207821527708:web:c431a44b23fbb438c62b59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
