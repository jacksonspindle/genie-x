import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
// import testImage from "../assets/downloaded-image.jpg";

export default function Hoodie({ hoodieImage, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/hoodie.gltf");

  const [texture, setTexture] = useState(null);
  const textureScaleX = 0.88; // Repeat twice along X
  const textureScaleY = 0.88; // Repeat twice along Y
  const textureOffsetX = -1.07; // Shift half way along X
  const textureOffsetY = -0.08;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      hoodieImage,
      (loadedTexture) => {
        loadedTexture.flipY = false;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.encoding = THREE.sRGBEncoding;
        loadedTexture.needsUpdate = true;
        loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
        // loadedTexture.repeat.set(1 / textureScaleX, 1 / textureScaleY);
        loadedTexture.offset.set(textureOffsetX, textureOffsetY);

        // loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error(
          "An error occurred while loading the texture.",
          error.message
        );
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

  // console.log(materials);

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
        {texture && (
          <meshStandardMaterial
            attach="material"
            map={texture}
            transparent={true}
            // alphaMap={texture}
          />
        )}
      </mesh>
      <mesh
        geometry={nodes.blank_hoodie001.geometry}
        material={materials.body}
        // position={[0, 0, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      ></mesh>
    </group>
  );
}

useGLTF.preload("/hoodie.gltf");
