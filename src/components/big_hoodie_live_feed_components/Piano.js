/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 piano.gltf 
*/

import React, { useRef, useState, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Color } from "three";

export function Piano(props) {
  const { nodes, materials } = useGLTF("/piano.gltf");
  const [selected, setIsSelected] = useState(false);
  const yellowMaterial = useMemo(() => {
    return new MeshStandardMaterial({ color: new Color("yellow") });
  }, []);

  return (
    <group
      {...props}
      dispose={null}
      onPointerEnter={() => setIsSelected(true)}
      onPointerLeave={() => setIsSelected(false)}
    >
      <group position={[2.692, 0.265, -4.598]} scale={[0.715, 0.476, 0.224]}>
        <mesh
          geometry={nodes.Cube006.geometry}
          material={selected ? yellowMaterial : materials["Piano surface"]}
        />
        <mesh
          geometry={nodes.Cube006_1.geometry}
          material={selected ? yellowMaterial : materials["Material.011"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/piano.gltf");