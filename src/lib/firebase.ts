import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Web app Firebase configuration (from Firebase Console → Project Settings → Web app)
const firebaseConfig = {
  apiKey: "AIzaSyC8ScwH9TOOIP0Td9DSiJigeGojB7KAODE",
  authDomain: "tasbeehly-baf66.firebaseapp.com",
  projectId: "tasbeehly-baf66",
  storageBucket: "tasbeehly-baf66.firebasestorage.app",
  messagingSenderId: "207821527708",
  appId: "1:207821527708:web:c431a44b23fbb438c62b59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
