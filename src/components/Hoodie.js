import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import testImage from "../assets/downloaded-image.jpg";

export default function Hoodie({ hoodieImage, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/hoodie.gltf");

  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      hoodieImage,
      (texture) => {
        texture.flipY = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;
        setTexture(texture);
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the texture.", error);
      }
    );
  }, [hoodieImage]);

  // useEffect(() => {
  //   console.log(hoodieImage);
  //   if (hoodieImage) {
  //     const image = new Image();
  //     image.crossOrigin = "anonymous";
  //     image.onload = async () => {
  //       const loader = new THREE.TextureLoader();
  //       loader.load(
  //         hoodieImage,
  //         (newTexture) => {
  //           newTexture.flipY = false;
  //           newTexture.minFilter = THREE.LinearFilter;
  //           newTexture.magFilter = THREE.LinearFilter;
  //           newTexture.encoding = THREE.sRGBEncoding;
  //           newTexture.needsUpdate = true;
  //           setTexture(newTexture);
  //         },
  //         undefined,
  //         (error) => {
  //           console.error(
  //             "An error occurred while loading the texture.",
  //             error
  //           );
  //         }
  //       );
  //     };
  //     image.src = hoodieImage;
  //   }
  // }, [hoodieImage]);

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.blank_hoodie002.geometry}
        material={materials.body}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.blank_hoodie001.geometry}
        material={materials.decal}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      >
        {texture && <meshStandardMaterial attach="material" map={texture} />}
      </mesh>
    </group>
  );
}

useGLTF.preload("/hoodie.gltf");
