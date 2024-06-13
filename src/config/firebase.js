// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAetuFWTeTdiJAkSMWmCoPZ96qsVh0ynS8",
  authDomain: "geniex-1d1e3.firebaseapp.com",
  projectId: "geniex-1d1e3",
  storageBucket: "geniex-1d1e3.appspot.com",
  messagingSenderId: "968671788729",
  appId: "1:968671788729:web:815fa915b001dc21e96568",
  measurementId: "G-QD1MERG937",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Function to upload an image to Firebase Storage
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

export { app, auth, db, storage, googleProvider, uploadImageToFirebase };
