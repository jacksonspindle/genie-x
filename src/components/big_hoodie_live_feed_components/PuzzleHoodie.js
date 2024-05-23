import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { db } from "../../config/firebase"; // Adjust the import path as necessary
import { collection, onSnapshot } from "firebase/firestore";
import axios from "axios";

const fetchImageThroughProxy = async (imageUrl) => {
  try {
    const response = await axios.get(
      "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy",
      {
        params: {
          imageUrl: imageUrl, // Pass the image URL as a parameter
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error fetching image through proxy:", error);
    return null;
  }
};

function PuzzlePiece({
  geometry,
  material,
  isAssigned,
  texture,
  index,

  ...props
}) {
  const mesh = useRef();
  const originalMaterial = material.clone();
  const hoverMaterial = material.clone();
  const textureMaterial = texture
    ? new THREE.MeshBasicMaterial({ map: texture })
    : null;

  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-56, -56); // Adjust these values to control the scaling
    texture.offset.y += 0.7; // Adjust this value to move the texture up on the y-axis
  }

  hoverMaterial.color.set("#ffff00"); // Brighter yellow color

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!isAssigned) {
      mesh.current.material = hoverMaterial;
      console.log(`Puzzle piece ${index + 1} is hovered and turned yellow`);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    mesh.current.material = isAssigned ? textureMaterial : originalMaterial;
  };

  useEffect(() => {
    mesh.current.material = isAssigned ? textureMaterial : originalMaterial;
  }, [isAssigned, textureMaterial, originalMaterial]);

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={mesh.current ? mesh.current.material : material}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    />
  );
}

export function PuzzleHoodie({ handleHover, handleLeave, ...props }) {
  const { nodes, materials } = useGLTF("/puzzleHoodie.gltf");
  const [assignedPieces, setAssignedPieces] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersRef, async (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });

      // Extract assigned puzzle piece IDs and their image URLs
      const assigned = await Promise.all(
        fetchedOrders.map(async (order) => {
          if (
            order.items &&
            order.items.length > 0 &&
            order.items[0].imageUrl
          ) {
            const proxyImageUrl = await fetchImageThroughProxy(
              order.items[0].imageUrl
            );
            return {
              puzzlePieceId: order.puzzlePieceId,
              imageUrl: proxyImageUrl,
              user: order.userName || "Unknown",
            };
          }
          return null;
        })
      );

      const validAssigned = assigned.filter((item) => item !== null);

      setAssignedPieces(validAssigned);

      // Log the assigned pieces as an object
      const assignedPiecesObject = {};
      for (let i = 0; i < validAssigned.length; i++) {
        assignedPiecesObject[validAssigned[i].puzzlePieceId] =
          validAssigned[i].imageUrl;
      }
      console.log("Assigned puzzle pieces:", assignedPiecesObject);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const pieces = Object.keys(nodes).filter((key) =>
    key.startsWith("Pattern2D")
  );

  return (
    <group {...props} dispose={null} rotation={[0, 3, 0]}>
      {pieces.map((key, index) => {
        const assignedPiece = assignedPieces.find(
          (piece) => piece.puzzlePieceId === index + 1
        );
        const texture = assignedPiece
          ? new THREE.TextureLoader().load(assignedPiece.imageUrl)
          : null;

        return (
          <PuzzlePiece
            key={key}
            geometry={nodes[key].geometry}
            material={materials["FABRIC 1_FRONT_2437"]}
            isAssigned={!!assignedPiece}
            texture={texture}
            index={index}
            assignedPiece={assignedPiece}
            user={assignedPiece ? assignedPiece.user : "Unknown"}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/puzzleHoodie.gltf");
