import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = ({ setSignedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
    } catch (ex) {
      console.log(ex);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSignedIn(true);
    } catch (ex) {
      console.log(ex);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={signIn}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign In With Google</button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};
