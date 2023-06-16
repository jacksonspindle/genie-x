import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function GenieLamp({ toggleGenieChat, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/genieLamp.gltf");

  const handleLampClick = () => {
    toggleGenieChat();
  };

  return (
    <group ref={group} {...props} dispose={null} onClick={handleLampClick}>
      <mesh
        geometry={nodes.Lamp.geometry}
        material={materials.Lampada}
        position={[0, 0.63, 0.11]}
        rotation={[-Math.PI + 0.4, -Math.PI / 2, -Math.PI]}
        scale={0.05}
      />
    </group>
  );
}

useGLTF.preload("/genieLamp.gltf");
