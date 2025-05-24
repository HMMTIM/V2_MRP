const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB7JFaj4FIHAMYsJs67-52891rpZ7Kf7iI",
  authDomain: "fek-mrp.firebaseapp.com",
  projectId: "fek-mrp",
  storageBucket: "fek-mrp.firebasestorage.app",
  messagingSenderId: "55890604824",
  appId: "1:55890604824:web:f6ca7f9e8309539303a46d",
  measurementId: "G-5W0QB08LYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  console.log('Usando apenas Firestore, não é necessária migração.');
}

migrateData().catch(console.error);