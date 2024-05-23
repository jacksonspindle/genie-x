import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Rug(props) {
  const { nodes, materials } = useGLTF("/rug.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane001.geometry}
        material={materials.Material}
        position={[-3.343, -0.441, -2.561]}
        scale={[-1.26, 1.206, 1.206]}
      />
    </group>
  );
}

useGLTF.preload("/rug.gltf");
