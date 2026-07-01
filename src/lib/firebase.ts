import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration, sourced from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyAqSA89Q8StNiRX4509mGL7X1Nb6NT3nLw",
  authDomain: "tasbeehly-baf66.firebaseapp.com",
  projectId: "tasbeehly-baf66",
  storageBucket: "tasbeehly-baf66.firebasestorage.app",
  messagingSenderId: "207821527708",
  appId: "1:207821527708:android:8487ce2dd0cea512c62b59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
