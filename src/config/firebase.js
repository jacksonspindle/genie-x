// Import the functions you need from the SDKs you need
import "firebase/storage";
import { getFirestore } from "firebase/firestore";

// import { getStorage } from "firebase/storage";
// import {
//   ref,
//   uploadString,
//   getDownloadURL,
//   uploadBytes,
// } from "firebase/storage";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getStorage, ref, uploadBytes } from "firebase/storage";

// import axios from "axios";
// import { getStorage } from "firebase/storage";
// import { firebase } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAetuFWTeTdiJAkSMWmCoPZ96qsVh0ynS8",
  authDomain: "geniex-1d1e3.firebaseapp.com",
  projectId: "geniex-1d1e3",
  storageBucket: "gs://geniex-1d1e3.appspot.com/",
  messagingSenderId: "968671788729",
  appId: "1:968671788729:web:815fa915b001dc21e96568",
  measurementId: "G-QD1MERG937",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const storage = getStorage(app);
const uploadImageToFirebase = async (file) => {
  try {
    const storageRef = ref(storage, "images/" + file.name);
    await uploadBytes(storageRef, file);
    console.log("Image uploaded successfully.");
    return storageRef;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
// const storage = getStorage(app);

const db = getFirestore(app);

export { uploadImageToFirebase, db };
