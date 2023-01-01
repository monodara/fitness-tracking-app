import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB85KdEwC1Pm86eGy_hkSBFgQK8CHGKUdM",
    authDomain: "calorietracking-7202c.firebaseapp.com",
    projectId: "calorietracking-7202c",
    storageBucket: "calorietracking-7202c.appspot.com",
    messagingSenderId: "341406000995",
    appId: "1:341406000995:web:0c2a62597c1fcf70431556",
    measurementId: "G-QLX87T4P88"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, {});
export { db, firebaseApp };