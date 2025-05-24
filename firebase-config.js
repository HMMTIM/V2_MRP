
// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Initialize Firebase with default config
const firebaseConfig = {
  apiKey: "AIzaSyCii27w0z57tmkgZdBnl2Kfl7NUqsEti8I",
  authDomain: "banco-naliteck.firebaseapp.com",
  projectId: "banco-naliteck",
  storageBucket: "banco-naliteck.firebasestorage.app",
  messagingSenderId: "273032566542",
  appId: "1:273032566542:web:d653f33a8f9e35cfb4a95f",
  measurementId: "G-YFYLSP2JJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
