import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { auth } from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import Hoodie from "./Hoodie";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import axios from "axios";

// collection component
const HoodieCollection = () => {
  const [hoodieCollection, setHoodieCollection] = useState([]);
  const db = getFirestore();

  const getUserCollection = useCallback(async () => {
    const user = auth.currentUser;
    const uid = user.uid;

    const designsQuery = query(collection(db, "users", uid, "designs"));

    const querySnapshot = await getDocs(designsQuery);

    const designs = [];
    querySnapshot.forEach((doc) => {
      const design = doc.data();
      designs.push(design);
    });

    console.log(designs);

    return designs;
  }, [db]);

  const fetchBase64Image = async (url) => {
    console.log(url);
    try {
      const response = await axios.post(
        "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/retrieve-collection",
        { urls: [url] } // Send the URL as an array
      );
      return response.data.base64Images[0]; // Access the first image since we are sending a single URL
    } catch (error) {
      throw new Error("Failed to fetch base64 image");
    }
  };

  useEffect(() => {
    getUserCollection().then((designs) => {
      const fetchImages = async () => {
        const updatedDesigns = [];
        for (const design of designs) {
          const base64Image = await fetchBase64Image(design.image);
          console.log("test");
          updatedDesigns.push({ ...design, base64Image });
        }

        console.log(updatedDesigns);
        setHoodieCollection(updatedDesigns);
      };
      fetchImages();
    });
  }, [getUserCollection]);

  return (
    <div>
      <h1>Hoodie Collection</h1>
      {/* Display the user's saved hoodie designs */}
      {hoodieCollection.map((hoodie) => (
        <Canvas key={hoodie.id}>
          <Environment preset="city" />
          <Hoodie hoodieImage={hoodie.base64Image} />
        </Canvas>
      ))}
    </div>
  );
};

export default HoodieCollection;
