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
import GenieChatFreeRange from "./GenieChatFreeRange";

const DesignPortal = () => {
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);

  const toggleGenieChat = () => {
    setIsGenieChatOpen(!isGenieChatOpen);
  };
  return (
    <div style={{ height: "100vh" }}>
      <div className="design-portal-container">
        <img src={slotsIcon} className="lottery-btn" />
        <img src={saveIcon} className="design-portal-btn" />
        <img src={screenshotIcon} className="design-portal-btn" />
        <img src={shareIcon} className="design-portal-btn" />
        <img src={helpIcon} className="design-portal-btn" />
      </div>
      <div className="checkout-btn-container">
        <button className="">Checkout</button>
      </div>

      <Canvas>
        <Hoodie />

        <OrbitControls zoomSpeed={0.5} maxDistance={20} minDistance={10} />
        <Environment preset="city" />
      </Canvas>
      <div className="genie-lamp-canvas">
        <Canvas>
          <GenieLamp toggleGenieChat={toggleGenieChat} />
          <Environment preset="city" />
        </Canvas>
      </div>
      {/* <GenieChat isOpen={isOpen} /> */}
      {isGenieChatOpen && <GenieChat isOpen={isGenieChatOpen} />}
      {/* <GenieChat /> */}
    </div>
  );
};

export default DesignPortal;