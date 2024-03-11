import React, { useMemo, useCallback, useState, useEffect } from "react";
import defaultProfilePic from "../assets/defaultProfile.webp";
import { Configuration, OpenAIApi } from "openai";
import { Ring } from "@uiball/loaders";
import axios from "axios";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

const Account = ({ setCurrentProfilePic, setTriggerProfileChange }) => {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);
  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  const [profilePicPrompt, setProfilePicPrompt] = useState("");
  const [generatedProfilePic, setGeneratedProfilePic] =
    useState(defaultProfilePic);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [profilePicsUrls, setProfilePicsUrls] = useState([]);
  const [userProfilePics, setUserProfilePics] = useState([]);

  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;

  const uploadImageToFirebase = useCallback(
    async (imageBlob) => {
      if (!user) {
        console.error("No user logged in!");
        return;
      }
      const imageRef = storageRef(
        storage,
        `profile-pics/${user.uid}/${Date.now()}.png`
      );

      try {
        // Uploading the blob to Firebase Storage
        const snapshot = await uploadBytes(imageRef, imageBlob);

        // Get the URL of the uploaded file
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Add a reference to Firestore
        const userDocRef = doc(
          db,
          "users",
          user.uid,
          "profile-pics",
          snapshot.ref.name
        );
        await setDoc(userDocRef, {
          imageUrl: downloadURL,
          timestamp: Date.now(), // You can store additional metadata as needed
        });

        console.log("Image uploaded and Firestore updated");
        return downloadURL; // Return the URL of the uploaded image
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
      }
    },
    [user, storage, db] // Add 'db' to the dependency array if it's defined outside of this callback
  );

  const fetchProfilePics = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      console.log("User is logged in, fetching pictures...");
      try {
        const profilePicsRef = collection(
          db,
          "users",
          user.uid,
          "profile-pics"
        );
        const querySnapshot = await getDocs(profilePicsRef);
        const urls = querySnapshot.docs.map((doc) => doc.data().imageUrl);
        setUserProfilePics(urls);
        console.log("Profile pictures fetched successfully.");
      } catch (error) {
        console.error("Error fetching profile pics:", error);
      }
    } else {
      console.log("No user logged in, cannot fetch pictures.");
    }
  };

  useEffect(() => {
    fetchProfilePics();
  }, []);

  const generateProfilePic = useCallback(async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await openai.createImage({
        model: "dall-e-3",
        prompt: profilePicPrompt,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = res.data.data[0].url;

      // Fetch the image through your proxy server
      const proxyUrl =
        "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy"; // Replace with your actual proxy server URL
      const proxyResponse = await axios.get(proxyUrl, {
        params: { imageUrl },
      });

      // Convert the base64 string back to a blob
      const base64Response = proxyResponse.data.imageUrl;
      const sliceSize = 512;
      const byteCharacters = atob(base64Response.split(",")[1]);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const imageBlob = new Blob(byteArrays, { type: "image/png" });

      // Upload the blob to Firebase
      const firebaseURL = await uploadImageToFirebase(imageBlob);

      // Fetch the updated profile pictures
      fetchProfilePics();

      // Update component state if necessary
      setGeneratedProfilePic(firebaseURL);
    } catch (error) {
      console.error("Failed to generate profile picture:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  }, [openai, profilePicPrompt, uploadImageToFirebase, fetchProfilePics]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      console.log(
        "User is logged in, setting up real-time listener for current profile pic..."
      );
      const userRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(userRef, (doc) => {
        const userData = doc.data();
        const currentProfilePic = userData.currentProfilePic;
        setGeneratedProfilePic(currentProfilePic);
        // setCurrentProfilePic(currentProfilePic); // Update parent state
        // setTriggerProfileChange(2);
        console.log("Current profile pic updated in real-time.");
      });

      return () => unsubscribe();
    } else {
      console.log(
        "No user logged in, cannot set up real-time listener for current profile pic."
      );
    }
  }, []);

  const changeProfilePic = async (imageUrl) => {
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, { currentProfilePic: imageUrl }, { merge: true });
      console.log("Current profile pic updated successfully.");
    } catch (error) {
      console.error("Error updating current profile pic:", error);
    }
  };

  return (
    <div className="account-container-outer">
      <div className="account-container">
        <h1>My Account</h1>
        <div className="generate-profile-container">
          <div className="loader-container">
            {" "}
            {/* Use the same container for loading and image */}
            {isLoading ? (
              <Ring size={30} lineWeight={5} speed={2} color="white" />
            ) : (
              <img
                src={generatedProfilePic}
                className="account-profile-pic"
                alt="Profile"
              />
            )}
          </div>
          <input
            placeholder="Generate a profile picture"
            value={profilePicPrompt}
            onChange={(e) => setProfilePicPrompt(e.target.value)}
          />
          <button onClick={generateProfilePic}>Generate</button>
        </div>
        <div className="account-info-container">
          <div className="personal-info-container">
            <h3>Personal Info</h3>
            <h4>Email:</h4>
            <h4>Name:</h4>
            <button className="reset-password-btn">Reset Password</button>
          </div>
          <div className="profile-pics-container">
            <h3>My Profile Pics</h3>
            <div className="users-profile-pics">
              {userProfilePics.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Profile pic ${index}`}
                  onClick={() => changeProfilePic(url)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
