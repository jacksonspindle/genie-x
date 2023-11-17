import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateAccount } from "./CreateAccount";

export const Auth = ({ setSignedIn, setToggleLogInPage }) => {
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // New state for error message

  const [toggleCreateAccount, setToggleCreateAccount] = useState(false);

  console.log(setToggleLogInPage);

  const loginBoxRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log("Currently logged in as:", user.email);
        setSignedIn(true); // Set signedIn state to true when user is signed in
      } else {
        // No user is signed in
        console.log("No user is currently logged in.");
        setSignedIn(false); // Set signedIn state to false when user is not signed in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setSignedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginBoxRef.current && !loginBoxRef.current.contains(event.target)) {
        setToggleLogInPage(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setToggleLogInPage]);

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
      toast("Signed In!");
      setToggleLogInPage(false);
    } catch (ex) {
      console.log(ex);
      if (ex.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (ex.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("An error occurred during sign in.");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSignedIn(true);
      toast("Signed In!");
      setToggleLogInPage(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  // const logout = async () => {
  //   try {
  //     await signOut(auth);
  //     toast("Signed Out!");
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  return !toggleCreateAccount ? (
    <CreateAccount
      setSignedIn={setSignedIn}
      setToggleLogInPage={setToggleLogInPage}
      setToggleCreateAccount={setToggleCreateAccount}
    />
  ) : (
    <div className="login-container">
      <div
        className="login-box"
        ref={loginBoxRef}
        style={{ fontFamily: "oatmeal-pro-regular" }}
      >
        <h1>Login</h1>
        <label>
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}{" "}
        {/* Display error message */}
        <button className="login-btn" onClick={signIn}>
          Login
        </button>
        <button className="google-btn" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div className="signup-option" style={{ color: "white" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setToggleCreateAccount(false)}
          >
            Create one
          </span>
        </div>
      </div>
    </div>
  );
};
