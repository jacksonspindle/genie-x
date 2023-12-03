import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import ImageEditor from "./ImageEditor";
// import slotsIcon from "../assets/slotsIcon.png";
// import saveIcon from "../assets/saveIcon.png";
// import screenshotIcon from "../assets/screenshotIcon.png";
// import shareIcon from "../assets/shareIcon.png";
// import helpIcon from "../assets/helpIcon.png";
// import GenieLamp from "./GenieLamp";
import GenieChat from "./GenieChat";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { getFirestore } from "firebase/firestore";
// import { motion } from "framer-motion";

// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import infoIcon from "../assets/infoIcon.png";
import genieXLogo from "../assets/genieXLogo.png";
import arrowIcon from "../assets/arrowIcon.png";
import xIcon from "../assets/xIcon.png";

// import PhotoPrompt from "./PhotoPrompt";
import PromptContainer from "./PromptContainer";
import { motion } from "framer-motion";

import {
  // getFirestore,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import ProductDetails from "./ProductDetails";
import { AnimatePresence } from "framer-motion";
import madLibsDemo from "../assets/madLibsDemo.mp4";
import freeRangeDemo from "../assets/freeRangeDemo.mp4";
import imageEditorDemo from "../assets/imageEditorDemo.mp4";
import addToCartDemo from "../assets/addToCartDemo.mp4";

// import { storage } from "../config/firebase"; // Make sure to import 'storage' from your Firebase configuration file.

// import GenieChatFreeRange from "./GenieChatFreeRange";

const InstructionalPopup = ({ instructionsOpen, setInstructionsOpen }) => {
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
          <h1 style={{ fontSize: "40px", color: "white" }}>
            Welcome to the GenieX App!
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
            <img
              src={genieXLogo}
              width={"80%"}
              alt="welcomeImage"
              style={{ backgroundColor: "transparent" }}
            />
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
    {
      id: 3,
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
            Image Editor
          </h1>
          <p
            style={{
              fontSize: "22px",
              padding: "0 4rem 0 4rem",
              textAlign: "center",
            }}
          >
            Use the image editor to refine details in your designs.
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
              src={imageEditorDemo}
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
            onClick={() => setInstructionsOpen(false)}
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

  return (
    <div className="carousel-container">
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
          key={carouselItems[current].id}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "100%",
            height: "90%",
            boxShadow: "none",
            backgroundColor: "transparent",
          }}
        >
          {carouselItems[current].content}
        </motion.div>
      </AnimatePresence>

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
    </div>
  );
};

function SetupCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 9; // Set the initial position of the camera
    camera.updateProjectionMatrix();
  }, [camera]);

  return null; // This component doesn't render anything visually
}

const DesignPortal = ({
  productDetails,
  setProductDetails,
  hoodieImage,
  setHoodieImage,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [dalleImages, setDalleImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [freeRangeInput, setFreeRangeInput] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);

  const [maskImage, setMaskImage] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  // const { camera } = useThree();
  // const [hoodieImage, setHoodieImage] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    console.log(hoodieImage);
  }, [hoodieImage]);

  const saveHoodieDesign = async () => {
    console.log("saving hoodie design");
    // hoodieImage ? toast("Saving to Your Collection!") : null;

    if (hoodieImage) {
      toast("Saving to Your Collection!");
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const uid = user.uid;
        const storageRef = ref(storage, `designs/${uid}/${Date.now()}.jpg`);

        await uploadString(storageRef, hoodieImage, "data_url");
        const downloadURL = await getDownloadURL(storageRef);

        const designData = {
          image: downloadURL,
          createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, "users", uid, "designs"), designData);

        toast("Added to Your Collection!");
      } catch (error) {
        console.error("Error saving hoodie design:", error);
        toast("You need to make a design first!");
      }
    } else {
      toast("You Need to Login First!");
      console.log("User is not authenticated or logged in.");
    }
  };

  console.log(saveHoodieDesign);

  useEffect(() => {
    console.log(productDetails);
  }, [productDetails]);

  const [freeRangeToggle, setFreeRangeToggle] = useState(false);
  const [freeRangePrompt, setFreeRangePrompt] = useState("a blue genie");
  const [isFreeRange, setIsFreeRange] = useState(false);

  const toggleSwitch = () => setFreeRangeToggle(!freeRangeToggle);

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const generateFreeRangeImage = () => {
    setIsFreeRange(true);
    setFreeRangeInput(!freeRangeInput);
  };

  return (
    <div style={{ height: "100vh" }} className="design-portal-container">
      <AnimatePresence>
        {instructionsOpen || editPopup ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)", // semi-transparent black
              zIndex: 1000, // Adjust as needed, should be less than the z-index of InstructionalPopup
            }}
          />
        ) : null}
      </AnimatePresence>
      {/* <div className="design-portal-container">
        <img alt="icons" src={slotsIcon} className="lottery-btn" />
        <img
          alt="icons"
          src={saveIcon}
          onClick={saveHoodieDesign}
          className="design-portal-btn"
        />
        <ToastContainer />
        <img alt="icons" src={screenshotIcon} className="design-portal-btn" />
        <img alt="icons" src={shareIcon} className="design-portal-btn" />
        <img alt="icons" src={helpIcon} className="design-portal-btn" />
      </div> */}
      {/* <div className="checkout-btn-container">
        <Link className="">Checkout</Link>
        <Link to="collection">My Collection</Link>
      </div> */}

      <AnimatePresence>
        {instructionsOpen ? (
          <div className="instructions-container">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InstructionalPopup
                setInstructionsOpen={setInstructionsOpen}
                instructionsOpen={instructionsOpen}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="hoodie_canvas">
        <div className="hoodie-canvas-left">
          <h3
            onClick={() => {
              setProductDetails(true);
              console.log(productDetails);
            }}
            className="product-details-button"
          >
            <img width={20} src={infoIcon} alt="info" />
            Product Details{" "}
          </h3>
          <div className="hoodie-scene">
            <Canvas>
              <SetupCamera />
              <Hoodie hoodieImage={hoodieImage} />

              <OrbitControls
                enablePan={true}
                target={[0, 0.8, 0]}
                zoomSpeed={0.5}
                // maxDistance={13}
                // minDistance={4}
              />
              <Environment preset="city" />
            </Canvas>
            <div className="free-range-input-container">
              <input
                className="free-range-input"
                placeholder="Type in a detailed description..."
                // disabled={!freeRangeToggle}
                style={{
                  backgroundColor: `${
                    !freeRangeToggle
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.4)"
                  }`,
                }}
                onChange={(e) => setFreeRangePrompt(e.target.value)}
              ></input>
              <button
                className="generate-image-free-range-btn"
                onClick={generateFreeRangeImage}
                // disabled={dallePrompt === "genie"}
              >
                Generate Image
              </button>
            </div>

            {/* <div
              className="switch"
              data-isOn={freeRangeToggle}
              onClick={toggleSwitch}
              style={{
                position: "absolute",
                margin: "1rem",
                backgroundColor: `${
                  !freeRangeToggle ? "rgba(255, 255, 255, 0.4)" : "#2685e3"
                } `,
              }}
            >
              <motion.div className="handle" layout transition={spring} />
            </div> */}
            <div
              style={{
                position: "absolute",
                left: 10,
                bottom: 0,
                // padding: "2rem",
              }}
            >
              <p>
                <em>
                  <b>Orbit</b>
                </em>{" "}
                - Click + Drag
              </p>
              <p>
                <em>
                  <b>Zoom</b>
                </em>{" "}
                - Scroll
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <PromptContainer
          isFreeRange={isFreeRange}
          setIsFreeRange={setIsFreeRange}
          freeRangeInput={freeRangeInput}
          editPrompt={editPrompt}
          maskImage={maskImage}
          hoodieImage={hoodieImage}
          dalleImages={dalleImages}
          setDalleImages={setDalleImages}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          setEditPopup={setEditPopup}
          editPopup={editPopup}
          setHoodieImage={setHoodieImage}
          freeRangeToggle={freeRangeToggle}
          setFreeRangeToggle={setFreeRangeToggle}
          freeRangePrompt={freeRangePrompt}
        />
      </div>

      {/* <motion.div className="genie-lamp-canvas">
        <Canvas>
          <GenieLamp toggleGenieChat={toggleGenieChat} />
          <Environment preset="city" />
        </Canvas> 
      </motion.div> */}
      {/* <GenieChat isOpen={isOpen} /> */}

      {editPopup && (
        <AnimatePresence>
          <ImageEditor
            setMaskImage={setMaskImage}
            maskImage={maskImage}
            setEditPrompt={setEditPrompt}
            editPrompt={editPrompt}
            hoodieImage={hoodieImage}
            setHoodieImage={setHoodieImage}
            dalleImages={dalleImages}
            setDalleImages={setDalleImages}
            setSelectedImageIndex={setSelectedImageIndex}
            selectedImageIndex={selectedImageIndex}
            editPopup={editPopup}
            setEditPopup={setEditPopup}
          />
        </AnimatePresence>
      )}

      {isGenieChatOpen && (
        <GenieChat
          setHoodieImage={setHoodieImage}
          // toggleGenieChat={toggleGenieChat}
          isGenieChatOpen={isGenieChatOpen}
          hoodieImage={hoodieImage}
        />
      )}
      {/* <GenieChat /> */}
    </div>
  );
};

export default DesignPortal;
