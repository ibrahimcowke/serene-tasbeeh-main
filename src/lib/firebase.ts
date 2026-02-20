import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEreFktmUV1ZjMZK0M3_jNuBVNoIIz_sA",
  authDomain: "ifis-850b5.firebaseapp.com",
  projectId: "ifis-850b5",
  storageBucket: "ifis-850b5.firebasestorage.app",
  messagingSenderId: "1000757744732",
  appId: "1:1000757744732:web:f9c4097aacda7a7b194299",
  // Note: If databaseURL is missing from your console snippet, ensure you have clicked "Create Database" 
  // in the Firebase Console under Build > Realtime Database.
  databaseURL: "https://ifis-850b5-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
