import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import slotsIcon from "../assets/slotsIcon.png";
import saveIcon from "../assets/saveIcon.png";
import screenshotIcon from "../assets/screenshotIcon.png";
import shareIcon from "../assets/shareIcon.png";
import helpIcon from "../assets/helpIcon.png";
import GenieLamp from "./GenieLamp";
import GenieChat from "./GenieChat";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import {
  // getFirestore,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

// import { storage } from "../config/firebase"; // Make sure to import 'storage' from your Firebase configuration file.

// import GenieChatFreeRange from "./GenieChatFreeRange";

const DesignPortal = ({ hoodieImage, setHoodieImage }) => {
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  // const [hoodieImage, setHoodieImage] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

  const toggleGenieChat = () => {
    setIsGenieChatOpen(!isGenieChatOpen);
  };

  const saveHoodieDesign = async () => {
    console.log("saving hoodie design");
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
      } catch (error) {
        console.error("Error saving hoodie design:", error);
      }
    } else {
      console.log("User is not authenticated or logged in.");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="design-portal-container">
        <img alt="icons" src={slotsIcon} className="lottery-btn" />
        <img
          alt="icons"
          src={saveIcon}
          onClick={saveHoodieDesign}
          className="design-portal-btn"
        />
        <img alt="icons" src={screenshotIcon} className="design-portal-btn" />
        <img alt="icons" src={shareIcon} className="design-portal-btn" />
        <img alt="icons" src={helpIcon} className="design-portal-btn" />
      </div>
      <div className="checkout-btn-container">
        <Link className="">Checkout</Link>
        <Link to="collection">My Collection</Link>
      </div>

      <Canvas>
        <Hoodie hoodieImage={hoodieImage} />

        <OrbitControls zoomSpeed={0.5} maxDistance={20} minDistance={10} />
        <Environment preset="city" />
      </Canvas>
      <motion.div className="genie-lamp-canvas">
        <Canvas>
          <GenieLamp toggleGenieChat={toggleGenieChat} />
          <Environment preset="city" />
        </Canvas>
      </motion.div>
      {/* <GenieChat isOpen={isOpen} /> */}
      {isGenieChatOpen && (
        <GenieChat
          setHoodieImage={setHoodieImage}
          toggleGenieChat={toggleGenieChat}
          isGenieChatOpen={isGenieChatOpen}
          hoodieImage={hoodieImage}
        />
      )}
      {/* <GenieChat /> */}
    </div>
  );
};

export default DesignPortal;
