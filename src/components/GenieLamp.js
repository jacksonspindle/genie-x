import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";

export default function GenieLamp({ toggleGenieChat, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/genieLamp.gltf");
  const [isHovered, setIsHovered] = useState(false);

  const handleLampClick = () => {
    toggleGenieChat();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <group ref={group} {...props} dispose={null} onClick={handleLampClick}>
      <motion.mesh
        geometry={nodes.Lamp.geometry}
        material={materials.Lampada}
        position={[0, 0.63, 0.11]}
        rotation={[-Math.PI + 0.4, -Math.PI / 2, -Math.PI]}
        scale={isHovered ? 0.06 : 0.05}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      />
    </group>
  );
}
