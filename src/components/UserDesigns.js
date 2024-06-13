import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { auth } from "../config/firebase";
import axios from "axios";

const UserDesigns = ({ setHoodieImage }) => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      const user = auth.currentUser;
      if (user) {
        const designsRef = collection(db, "users", user.uid, "saved-designs");
        const q = query(designsRef);
        const querySnapshot = await getDocs(q);
        const userDesigns = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDesigns(userDesigns);
      } else {
        console.log("No user logged in");
      }
    };

    fetchDesigns();
  }, []);

  const handleDesignSelection = async (imageUrl) => {
    try {
      const proxyUrl = `https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy?imageUrl=${encodeURIComponent(
        imageUrl
      )}`;
      const response = await axios.get(proxyUrl);
      const base64ImageUrl = response.data.imageUrl;
      setHoodieImage(base64ImageUrl);
    } catch (error) {
      console.error("Error fetching image through proxy:", error);
    }
  };

  return (
    <div
      className="user-designs-container"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        overflowY: "scroll",
        height: "37vh",
      }}
    >
      {designs.map((design) => (
        <div
          key={design.id}
          className="user-design-container"
          style={{ cursor: "pointer" }}
          onClick={() => handleDesignSelection(design.imageUrl)}
        >
          <img
            className="user-design"
            src={design.imageUrl}
            alt="User Design"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}
    </div>
  );
};

export default UserDesigns;
