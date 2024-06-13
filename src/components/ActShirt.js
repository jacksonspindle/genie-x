import React, { useRef } from "react";
import { useGLTF, OrthographicCamera } from "@react-three/drei";

export function ActShirt({ scrollPosition }) {
  const { nodes, materials } = useGLTF("/actShirt.gltf");
  return (
    <group dispose={null}>
      <group scale={0.008}>
        <group position={[0.53, 26, 174.257]} scale={0.678 / 3}>
          <mesh
            geometry={nodes.Tshirt.geometry}
            material={nodes.Tshirt.material}
            position={[-11.52, 26, -0.419]}
            scale={[1.225, 1.225, 0.552]}
          />
        </group>
        <directionalLight
          intensity={0.516}
          decay={2}
          position={[0, -scrollPosition / 10, 0]}
        />
        <OrthographicCamera
          makeDefault={false}
          far={100000}
          near={0}
          position={[-90.633, -108.644, 692.71 + scrollPosition * 2]}
          rotation={[0, -scrollPosition / 1000, 0]}
        />
        <OrthographicCamera
          makeDefault={false}
          far={100000}
          near={0}
          position={[-907.417, -803.372, 2699.627 + scrollPosition * 2]}
          rotation={[0.021, -0.289, 0.006]}
        />
        <mesh
          geometry={nodes.Rectangle_12.geometry}
          material={nodes.Rectangle_12.material}
          position={[-48, scrollPosition - 200, 32]}
        />
        {/* <mesh
          geometry={nodes.Sphere.geometry}
          material={nodes.Sphere.material}
          position={[-56.858, scrollPosition, -834.865]}
          scale={1.23}
        /> */}
        <mesh
          geometry={nodes.Rectangle_9.geometry}
          material={nodes.Rectangle_9.material}
          position={[0.153, scrollPosition, 21]}
          scale={0.25}
        />
        <mesh
          geometry={nodes.Text.geometry}
          material={nodes.Text.material}
          position={[-50.726, -895.29 + scrollPosition / 10, 10.614]}
          scale={[1, 1, 10.593]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/actShirt.gltf");
