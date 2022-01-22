// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBtVlQKDwYamry7pNBUhtulMdKPfRdjcvE",
  authDomain: "my-graph-junior.firebaseapp.com",
  projectId: "my-graph-junior",
  storageBucket: "my-graph-junior.appspot.com",
  messagingSenderId: "865047661724",
  appId: "1:865047661724:web:346e18c30ef6640adbb159",
  measurementId: "G-C3EC0T18PN"
};

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// const db = getFirestore()

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore()
