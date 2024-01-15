import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import ImageEditor from "./ImageEditor";
import { CreateAccount } from "./CreateAccount";
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
import UserDesigns from "./UserDesigns";
// import { motion } from "framer-motion";

// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import infoIcon from "../assets/infoIcon.png";
import genieXLogo from "../assets/genieXLogo.png";
import arrowIcon from "../assets/arrowIcon.png";
import xIcon from "../assets/xIcon.png";
import uploadImageIcon from "../assets/uploadImageIcon.png";
import genieXAssetsIcon from "../assets/genieXAssetsIcon.png";
import starsIcon from "../assets/starsIcon.png";
import savedDesignsIcon from "../assets/savedDesignsIcon.png";

// import PhotoPrompt from "./PhotoPrompt";
import PromptContainer from "./PromptContainer";
import { motion } from "framer-motion";
import InstructionalPopup from "./InstructionalPopup";
import ImageUpload from "./ImageUpload";
import AssetLibrary from "./AssetLibrary";

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
import { NewHoodie } from "./NewGenieXHoodie";

// import { storage } from "../config/firebase"; // Make sure to import 'storage' from your Firebase configuration file.

// import GenieChatFreeRange from "./GenieChatFreeRange";

const TabContent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ type: "spring", stiffness: 300, damping: 30, duration: 2 }}
  >
    {children}
  </motion.div>
);

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
  setSignedIn,
  setToggleLogInPage,
}) => {
  // console.log("In DesignPortal, setSignedIn is: ", typeof setSignedIn);

  // eslint-disable-next-line no-unused-vars
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [dalleImages, setDalleImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [freeRangeInput, setFreeRangeInput] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [createAccountPopUp, setCreateAccountPopUp] = useState(false);

  const [maskImage, setMaskImage] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const tabs = [
    { name: "generate", icon: starsIcon },
    { name: "upload", icon: uploadImageIcon },
    { name: "assets", icon: genieXAssetsIcon },
    { name: "designs", icon: savedDesignsIcon },
  ]; // Array to map buttons with icons // Array to map buttons
  const underlineStyle = {
    width: "25%", // Since there are three tabs
    transition: { duration: 0.2 },
    x: `${tabs.findIndex((tab) => tab.name === activeTab) * 100}%`,
  };

  // const { camera } = useThree();
  // const [hoodieImage, setHoodieImage] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

  // useEffect(() => {
  //   console.log(hoodieImage);
  // }, [hoodieImage]);

  useEffect(() => {
    console.log("Hoodie image changes:");
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

  // useEffect(() => {
  //   console.log(productDetails);
  // }, [productDetails]);

  const [freeRangeToggle, setFreeRangeToggle] = useState(false);
  const [freeRangePrompt, setFreeRangePrompt] = useState("a blue genie");

  const [isFreeRange, setIsFreeRange] = useState(false);
  const [triggerCounter, setTriggerCounter] = useState(0);

  const toggleSwitch = () => setFreeRangeToggle(!freeRangeToggle);

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const generateFreeRangeImage = () => {
    setTriggerCounter((prev) => prev + 1); // Increment the counter
    setIsFreeRange(true);
    setFreeRangeInput(!freeRangeInput);
    console.log("testing image");
    setHoodieImage("free");
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
                createAccountPopUp={createAccountPopUp}
                setCreateAccountPopUp={setCreateAccountPopUp}
                setSignedIn={setSignedIn}
                setToggleLogInPage={setToggleLogInPage}
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
              {/* <Hoodie hoodieImage={hoodieImage} /> */}
              <NewHoodie genieXLogo={genieXLogo} hoodieImage={hoodieImage} />
              <OrbitControls
                enablePan={true}
                target={[0, 0.8, 0]}
                zoomSpeed={0.5}
                maxDistance={13}
                minDistance={4}
              />
              <Environment preset="city" />
              <ambientLight intensity={0.2} />
              {/* <directionalLightHelper /> */}
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
        <div className="tab-buttons">
          <div className="tab-container">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={activeTab === tab.name ? "active" : ""}
                onClick={() => setActiveTab(tab.name)}
              >
                <img
                  style={{
                    width: "40px",

                    padding: "2px",
                  }}
                  src={tab.icon}
                  alt={tab.name}
                />
              </button>
            ))}
          </div>
          {/* Underline element */}
          <motion.div
            className="underline-2"
            initial={false}
            animate={underlineStyle}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "generate" && (
            <TabContent key="generate">
              <PromptContainer
                triggerCounter={triggerCounter}
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
            </TabContent>
          )}

          {activeTab === "upload" && (
            <TabContent key="upload">
              <ImageUpload setHoodieImage={setHoodieImage} />
            </TabContent>
          )}

          {activeTab === "assets" && (
            <TabContent key="assets">
              <AssetLibrary setHoodieImage={setHoodieImage} />
            </TabContent>
          )}

          {activeTab === "designs" && (
            <TabContent key="designs">
              <UserDesigns setHoodieImage={setHoodieImage} />
            </TabContent>
          )}
        </AnimatePresence>
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
