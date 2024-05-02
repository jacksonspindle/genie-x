import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../config/firebase";

import { motion } from "framer-motion";
import genieXLogo from "../assets/genieXLogo.png";
// import actofcreationlogo from "../assets/actofcreationLogo.svg";
import actofcreationicon from "../assets/actofcreationicon.svg";
import { AnimatePresence } from "framer-motion";
import madLibsDemo from "../assets/madLibsDemo.mp4";
import freeRangeDemo from "../assets/freeRangeDemo.mp4";
import imageEditorDemo from "../assets/imageEditorDemo.mp4";
import addToCartDemo from "../assets/addToCartDemo.mp4";
import { Auth } from "./auth";
import arrowIcon from "../assets/arrowIcon.png";
import googleIcon from "../assets/googleIcon.png";
import xIcon from "../assets/xIcon.png";
import { CreateAccount } from "./CreateAccount";
import { toast } from "react-toastify";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

const InstructionalPopup = ({
  instructionsOpen,
  setInstructionsOpen,
  createAccountPopUp,
  setCreateAccountPopUp,

  setSignedIn,
  setToggleLogInPage,
}) => {
  const carouselItems = [
    {
      id: 0,
      content: (
        <div
          style={{
            borderRadius: "1rem",
            width: "100%",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box", // Add this line
            // justifyContent: "center",
            alignItems: "center",
            height: "100%",
            boxShadow: "none",
            backgroundColor: "transparent",
            // backgroundColor: "red",
          }}
          className="slide1"
        >
          <h1 style={{ fontSize: "50px", color: "white", paddingTop: "40px" }}>
            Welcome to <br></br> Act of Creation
          </h1>
          <div
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            {/* <img
              src={actofcreationlogo}
              width={"80%"}
              alt="welcomeImage"
              style={{ backgroundColor: "transparent" }}
            /> */}
            <img
              src={actofcreationicon}
              width={"35%"}
              alt="welcomeImage"
              style={{ backgroundColor: "transparent" }}
            />
            {/* <img
              src={actofcreationlogo}
              width={"80%"}
              alt="welcomeImage"
              style={{ backgroundColor: "transparent" }}
            /> */}
          </div>
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div
          style={{
            borderRadius: "1rem",
            width: "100%",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box", // Add this line
            // justifyContent: "center",
            alignItems: "center",
            height: "100%",
            boxShadow: "none",
            backgroundColor: "transparent",

            // backgroundColor: "red",
          }}
          className="slide1"
        >
          <h1 style={{ fontSize: "40px", color: "white", marginBottom: "0" }}>
            Prompt Editor
          </h1>
          <p
            style={{
              fontSize: "22px",
              padding: "0 4rem 0 4rem",
              textAlign: "center",
            }}
          >
            Click colored words to replace them with your own ideas by typing or
            using suggestions in the dropdown.
          </p>
          <div
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            <video
              src={madLibsDemo}
              width={window.innerHeight > 750 ? "90%" : "400px"}
              autoPlay
              loop
              muted
              className="madlibs-video"
              alt="welcomeImage"
              style={{
                // border: "2px solid red",
                backgroundColor: "transparent",
                borderRadius: "0",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div
          style={{
            borderRadius: "1rem",
            width: "100%",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box", // Add this line
            // justifyContent: "center",
            alignItems: "center",
            height: "100%",
            boxShadow: "none",
            backgroundColor: "transparent",

            // backgroundColor: "red",
          }}
          className="slide1"
        >
          <h1 style={{ fontSize: "40px", color: "white", marginBottom: "0" }}>
            Free Range Tool
          </h1>
          <p
            style={{
              fontSize: "22px",
              padding: "0 4rem 0 4rem",
              textAlign: "center",
            }}
          >
            Type a detailed description of anything you want to create
          </p>
          <div
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            <video
              src={freeRangeDemo}
              width={"90%"}
              autoPlay
              loop
              muted
              alt="welcomeImage"
              style={{ backgroundColor: "transparent", borderRadius: "1rem" }}
            />
          </div>
        </div>
      ),
    },
    // {
    //   id: 3,
    //   content: (
    //     <div
    //       style={{
    //         borderRadius: "1rem",
    //         width: "100%",
    //         padding: "1rem",
    //         display: "flex",
    //         flexDirection: "column",
    //         boxSizing: "border-box", // Add this line
    //         // justifyContent: "center",
    //         alignItems: "center",
    //         height: "100%",
    //         boxShadow: "none",
    //         backgroundColor: "transparent",

    //         // backgroundColor: "red",
    //       }}
    //       className="slide1"
    //     >
    //       <h1 style={{ fontSize: "40px", color: "white", marginBottom: "0" }}>
    //         Image Editor
    //       </h1>
    //       <p
    //         style={{
    //           fontSize: "22px",
    //           padding: "0 4rem 0 4rem",
    //           textAlign: "center",
    //         }}
    //       >
    //         Use the image editor to refine details in your designs.
    //       </p>
    //       <div
    //         style={{
    //           backgroundColor: "transparent",
    //           width: "100%",
    //           height: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           boxShadow: "none",
    //         }}
    //       >
    //         <video
    //           src={imageEditorDemo}
    //           width={"90%"}
    //           autoPlay
    //           loop
    //           muted
    //           alt="welcomeImage"
    //           style={{ backgroundColor: "transparent", borderRadius: "1rem" }}
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
    {
      id: 4,
      content: (
        <div
          style={{
            borderRadius: "1rem",
            width: "100%",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box", // Add this line
            // justifyContent: "center",
            alignItems: "center",
            height: "100%",
            boxShadow: "none",
            backgroundColor: "transparent",

            // backgroundColor: "red",
          }}
          className="slide1"
        >
          <h1 style={{ fontSize: "40px", color: "white", marginBottom: "0" }}>
            Add To Cart
          </h1>
          <p
            style={{
              fontSize: "22px",
              padding: "0 4rem 0 4rem",
              textAlign: "center",
            }}
          >
            Add designs to your cart when your happy with them.
          </p>
          <div
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            <video
              src={addToCartDemo}
              width={"90%"}
              autoPlay
              loop
              muted
              alt="welcomeImage"
              style={{ backgroundColor: "transparent", borderRadius: "1rem" }}
            />
          </div>
          <button
            style={{
              height: "50px",
              padding: ".7rem",
              marginTop: "1rem",
              borderRadius: ".5rem",
              border: "none",
              fontFamily: "oatmeal-pro-regular",
              backgroundColor: "rgb(113,170,250)",
              color: "black",
              fontSize: "15px",
              cursor: "pointer",
              transition: "ease-in-out all .2s",
            }}
            className="get-started-btn"
            onClick={() => setCreateAccountPopUp(true)}
          >
            Get Started
          </button>
        </div>
      ),
    },
  ];

  const [current, setCurrent] = useState(0);

  const renderNavigationCircles = () => {
    return carouselItems.map((item, index) => (
      <div
        key={item.id}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          margin: "5px",
          backgroundColor: current === index ? "rgb(113,170,250)" : "white",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={() => setCurrent(index)}
      />
    ));
  };

  const nextSlide = () =>
    setCurrent((current) => (current + 1) % carouselItems.length);
  const prevSlide = () =>
    setCurrent((current) =>
      current === 0 ? carouselItems.length - 1 : current - 1
    );

  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // New state for error message
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");

  const [toggleCreateAccount, setToggleCreateAccount] = useState(false);

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

  //   const signIn = async () => {
  //     try {
  //       await signInWithEmailAndPassword(auth, email, password);
  //       setSignedIn(true);
  //       toast("Signed In!");
  //       setToggleLogInPage(false);
  //     } catch (ex) {
  //       console.log(ex);
  //       if (ex.code === "auth/wrong-password") {
  //         setError("Incorrect password. Please try again.");
  //       } else if (ex.code === "auth/user-not-found") {
  //         setError("No user found with this email.");
  //       } else {
  //         setError("An error occurred during sign in.");
  //       }
  //     }
  //   };

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

  const [emailWithoutGoogle, setEmailWithoutGoogle] = useState("");
  const [passwordWithoutEmail, setPasswordWithoutEmail] = useState("");

  const signInWithoutGoogle = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
      toast("Signed In!");
      setToggleLogInPage(false);
      setInstructionsOpen(false);
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
      setInstructionsOpen(false);
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
      setInstructionsOpen(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setRePassword("");
    setName("");
    setEmailWithoutGoogle("");
    setPasswordWithoutEmail("");
    console.log("reseetting form");
  };

  return (
    <div className="carousel-container" style={{ boxShadow: "none" }}>
      <img
        src={xIcon}
        width={30}
        style={{
          filter: "invert(100%)",
          position: "absolute",
          padding: ".3rem",
          cursor: "pointer",
          zIndex: "1000",
          // right: "340px",
          // left: 0,
        }}
        onClick={() => setInstructionsOpen(false)}
        alt="close"
      />
      <AnimatePresence mode="wait">
        <motion.div
          className="1"
          key={carouselItems[current].id}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            height: "90%",
            boxShadow: "none",
            backgroundColor: "transparent",
            // backgroundColor: "red",
          }}
        >
          {createAccountPopUp ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 1 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "none",
              }}
            >
              {!toggleCreateAccount ? (
                <motion.div
                  key="createAccountForm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 1 }}
                >
                  <div
                    ref={loginBoxRef}
                    style={{
                      fontFamily: "oatmeal-pro-regular",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "2rem",
                      boxSizing: "border-box",
                      gap: ".5rem",
                      boxShadow: "none",
                    }}
                  >
                    <h1 style={{ color: "white" }}>Create Account</h1>
                    <label>
                      Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      // placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                    />

                    <label>
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      //   placeholder="Email"
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
                      value={rePassword}
                      type="password"
                      // placeholder="Re-enter Password"
                      onChange={(e) => setRePassword(e.target.value)}
                      style={{ marginBottom: "1rem" }}
                    />

                    {error && (
                      <div style={{ color: "red", width: "100%" }}>{error}</div>
                    )}
                    {/* Display error message */}
                    <button
                      style={{ backgroundColor: "#71AAFA", color: "black" }}
                      className="login-btn"
                      onClick={signIn}
                    >
                      Create Account
                    </button>
                    <button
                      className="google-btn"
                      onClick={signInWithGoogle}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 0,
                        backgroundColor: "white",
                        color: "black",
                      }}
                    >
                      <img src={googleIcon} width={40} alt="google" />
                      Sign up with Google
                    </button>
                    <div
                      style={{
                        color: "white",
                        width: "100%",
                        marginTop: "1rem",
                      }}
                    >
                      Already have an account?
                      <span
                        style={{
                          color: "#71AAFA",
                          cursor: "pointer",
                        }}
                        // href="javascript:void(0)" /* eslint-enable no-unused-vars */
                        onClick={(e) => {
                          /* eslint-enable no-unused-vars */
                          e.preventDefault();
                          setToggleCreateAccount(
                            true
                          ); /* eslint-enable no-unused-vars */

                          resetForm();
                          console.log("going to sign in");
                        }}
                      >
                        {" "}
                        Sign In
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signInForm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 1 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    // backgroundColor: "red",
                    height: "100%",
                    // flexDirection: "column",
                    alignItems: "center",

                    boxSizing: "border-box",
                    boxShadow: "none",
                  }}
                >
                  <div
                    className="test1"
                    ref={loginBoxRef}
                    style={{
                      marginTop: "5.5rem",
                      fontFamily: "oatmeal-pro-regular",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "45%",
                      boxShadow: "none",
                      gap: "1rem",
                    }}
                  >
                    <h1 style={{ color: "white" }}>Login</h1>
                    <label>
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      value={email}
                      type="email"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ marginBottom: "1rem" }}
                    />
                    {error && (
                      <div style={{ color: "red", width: "100%" }}>{error}</div>
                    )}{" "}
                    {/* Display error message */}
                    <button
                      className="login-btn"
                      onClick={signInWithoutGoogle}
                      style={{ color: "black" }}
                    >
                      Login
                    </button>
                    <button
                      className="google-btn"
                      onClick={signInWithGoogle}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 0,
                        backgroundColor: "white",
                        color: "black",
                      }}
                    >
                      <img src={googleIcon} width={40} alt="google" />
                      Sign up with Google
                    </button>
                    <div
                      style={{
                        color: "white",
                        width: "100%",
                        boxShadow: "none",
                      }}
                    >
                      Don't have an account?{" "}
                      <span
                        style={{ color: "#71AAFA", cursor: "pointer" }}
                        onClick={() => {
                          setToggleCreateAccount(false);
                          resetForm();
                        }}
                      >
                        Create one
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              ;
            </motion.div>
          ) : (
            carouselItems[current].content
          )}
        </motion.div>
      </AnimatePresence>

      {createAccountPopUp === false ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          className="arrow-container"
        >
          {/* Left arrow */}
          <img
            src={arrowIcon} // Replace with your arrow image path
            width={30}
            style={{
              transform: "scaleX(-1)",
              filter: "invert(1)",
              cursor: "pointer",
              marginRight: "1rem",
            }}
            alt="Previous"
            onClick={prevSlide}
          />

          {renderNavigationCircles()}

          {/* Right arrow */}
          <img
            src={arrowIcon} // Replace with your arrow image path
            width={30}
            style={{
              filter: "invert(1)",
              cursor: "pointer",
              marginLeft: "1rem",
            }}
            alt="Next"
            onClick={nextSlide}
          />
        </div>
      ) : null}
    </div>
  );
};

export default InstructionalPopup;
