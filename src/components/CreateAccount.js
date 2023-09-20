import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CreateAccount = ({
  setToggleCreateAccount,
  setSignedIn,
  setToggleLogInPage,
}) => {
  /* eslint-disable no-unused-vars */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* eslint-enable no-unused-vars */

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

  /* eslint-enable no-unused-vars */
  // const logout = async () => {
  //   try {
  //     await signOut(auth);
  //     toast("Signed Out!");
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };
  /* eslint-enable no-unused-vars */

  return (
    <div className="login-container">
      <div className="login-box" ref={loginBoxRef}>
        <h1>Login</h1>
        <input type="name" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="re-enter password" placeholder="Re-enter Password" />
        <button className="login-btn" onClick={signIn}>
          Create Account
        </button>
        <button className="google-btn" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div className="signup-option" style={{ color: "white" }}>
          Already have an account?
          <span
            style={{ color: "blue", cursor: "pointer" }}
            // href="javascript:void(0)" /* eslint-enable no-unused-vars */
            onClick={(e) => {
              /* eslint-enable no-unused-vars */
              e.preventDefault();
              setToggleCreateAccount(false); /* eslint-enable no-unused-vars */
            }}
          >
            {" "}
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};
