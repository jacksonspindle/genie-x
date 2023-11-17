import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAuth,
  sendEmailVerification,
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
  const [name, setName] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState(""); // New state for error message
  /* eslint-enable no-unused-vars */

  // console.log(setToggleLogInPage);

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

  useEffect(() => {
    console.log(auth?.currentUser?.email);
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!name || !email || !password || !rePassword) {
      setError("Please fill out all required fields.");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError(""); // Clear error message if validation passes
    return true;
  };

  const signIn = async () => {
    if (!validateForm()) return;

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Now that the user is created, you can send a verification email.
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user); // This is how it's used according to the docs.
        toast("Account created! Please verify your email.");
      }

      setSignedIn(true);
      setToggleLogInPage(false);
    } catch (ex) {
      // handle errors
      console.log(ex);
      if (ex.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else {
        setError("An error occurred during account creation.");
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
      <div
        className="login-box"
        ref={loginBoxRef}
        style={{ fontFamily: "oatmeal-pro-regular" }}
      >
        <h1>Create Account</h1>
        <label>
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          // placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <label>
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="email"
          // placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="password"
          // placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          Re-enter Password <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="password"
          // placeholder="Re-enter Password"
          onChange={(e) => setRePassword(e.target.value)}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}
        {/* Display error message */}
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
              setToggleCreateAccount(true); /* eslint-enable no-unused-vars */
              console.log("going to sign in");
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
