import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
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

// import PhotoPrompt from "./PhotoPrompt";
import PromptContainer from "./PromptContainer";

import {
  // getFirestore,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

// import { storage } from "../config/firebase"; // Make sure to import 'storage' from your Firebase configuration file.

// import GenieChatFreeRange from "./GenieChatFreeRange";

function SetupCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 9; // Set the initial position of the camera
    camera.updateProjectionMatrix();
  }, [camera]);

  return null; // This component doesn't render anything visually
}

const DesignPortal = ({ hoodieImage, setHoodieImage }) => {
  // eslint-disable-next-line no-unused-vars
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  // const { camera } = useThree();
  // const [hoodieImage, setHoodieImage] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

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

  return (
    <div style={{ height: "100vh" }} className="design-portal-container">
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

      <div className="hoodie_canvas">
        <div className="hoodie-canvas-left">
          <div className="hoodie-scene">
            <Canvas>
              <SetupCamera />
              <Hoodie hoodieImage={hoodieImage} />

              <OrbitControls
                enablePan={true}
                target={[0, 0.8, 0]}
                zoomSpeed={0.5}
                maxDistance={13}
                minDistance={4}
              />
              <Environment preset="city" />
            </Canvas>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <PromptContainer setHoodieImage={setHoodieImage} />
      </div>

      {/* <motion.div className="genie-lamp-canvas">
        <Canvas>
          <GenieLamp toggleGenieChat={toggleGenieChat} />
          <Environment preset="city" />
        </Canvas>
      </motion.div> */}
      {/* <GenieChat isOpen={isOpen} /> */}
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
