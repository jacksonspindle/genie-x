import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
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
  const [toggleCreateAccount, setToggleCreateAccount] = useState(false);

  console.log(setToggleLogInPage);

  const loginBoxRef = useRef(null);

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
      await createUserWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
      toast("Signed In!");
    } catch (ex) {
      console.log(ex);
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
    <div className="login-container">
      <div className="login-box" ref={loginBoxRef}>
        <h1>Login</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
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
            onClick={() => setToggleCreateAccount(true)}
          >
            Create one
          </span>
        </div>
      </div>
    </div>
  ) : (
    <CreateAccount
      setSignedIn={setSignedIn}
      setToggleLogInPage={setToggleLogInPage}
      setToggleCreateAccount={setToggleCreateAccount}
    />
  );
};
