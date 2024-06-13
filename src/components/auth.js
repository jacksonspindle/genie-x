import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateAccount } from "./CreateAccount";

export const Auth = ({ setSignedIn, setToggleLogInPage }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toggleCreateAccount, setToggleCreateAccount] = useState(false);
  const loginBoxRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
        navigate("/design");
      } else {
        setSignedIn(false);
      }
    });
    return () => unsubscribe();
  }, [setSignedIn, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginBoxRef.current && !loginBoxRef.current.contains(event.target)) {
        setToggleLogInPage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setToggleLogInPage]);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
      toast("Signed In!");
      setToggleLogInPage(false);
      navigate("/design");
    } catch (ex) {
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
      // Check for user authentication state
      auth.onAuthStateChanged((user) => {
        if (user) {
          setSignedIn(true);
          toast("Signed In!");
          setToggleLogInPage(false);
          navigate("/design");
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  };

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
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button className="login-btn" onClick={signIn}>
          Login
        </button>
        <button className="google-btn" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div className="signup-option" style={{ color: "white" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#4a90e2", cursor: "pointer" }}
            onClick={() => setToggleCreateAccount(true)}
          >
            Create one
          </span>
        </div>
      </div>
    </div>
  );
};
