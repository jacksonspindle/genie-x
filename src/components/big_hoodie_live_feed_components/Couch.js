import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Couch(props) {
  const { nodes, materials } = useGLTF("/couch.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.01]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
      <mesh
        geometry={nodes.Plane002.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.01]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
      <mesh
        geometry={nodes.Plane001_Plane003.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.01]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
      <mesh
        geometry={nodes.Plane003_Plane010.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.01]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
      <mesh
        geometry={nodes.Plane004_Plane011.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.01]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
      <mesh
        geometry={nodes.Circle.geometry}
        material={materials.Couch}
        position={[-3.339, -0.452, -4.004]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.619}
      />
    </group>
  );
}

useGLTF.preload("/couch.gltf");
