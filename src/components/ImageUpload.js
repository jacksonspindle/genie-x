import React, { useRef, useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import axios from "axios";

const ImageUpload = ({ setHoodieImage }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageJustLoaded, setImageJustLoaded] = useState(false);
  const fileInputRef = useRef();
  const updateTimeoutRef = useRef(null);
  const [images, setImages] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserImagesFromFirestore = useCallback(async (uid) => {
    if (!uid) return;

    // Reference to the user's Firestore document
    const userDocRef = doc(db, "users", uid);

    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Extract the images array from the Firestore document
          const userData = docSnapshot.data();
          console.log("userData", userData);
          setUserImages(userData.images || []);
        } else {
          console.log("No user document found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching user images from Firestore:", error);
      });
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchUserImagesFromFirestore(user.uid);
    }
  }, [fetchUserImagesFromFirestore]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchUserImagesFromFirestore(user.uid);
    }
  }, [images]); // This will trigger the effect when the `images` state changes

  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setZoom(1); // Reset zoom when new image is loaded
        setImageSrc(reader.result);
        setImageJustLoaded(true); // Indicate that the image was just loaded

        setHoodieImage(reader.result);

        // Log the UID of the currently logged-in user
        const user = auth.currentUser;
        if (user) {
          console.log("Current user UID:", user.uid);
          uploadAndSaveImage(file, user.uid);
        } else {
          console.error("No user is currently logged in.");
        }
      };
    }
  }, []);

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) {
      // If croppedAreaPixels is not set yet, we cannot crop the image.
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setHoodieImage(croppedImage);
      if (imageJustLoaded) {
        setImageJustLoaded(false); // Reset the flag after the image is set
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, setHoodieImage, imageJustLoaded]);

  // Effect for delayed updates on zoom and reposition
  useEffect(() => {
    if (!imageJustLoaded && croppedAreaPixels) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        createCroppedImage();
      }, 1000); // Apply the delay only when not due to an image load
    }
  }, [zoom, crop, imageJustLoaded, createCroppedImage]);

  // Effect for immediate update on image load
  useEffect(() => {
    if (imageSrc && imageJustLoaded) {
      createCroppedImage();
    }
  }, [imageSrc, imageJustLoaded, createCroppedImage]);

  const borderStyle = isDragOver ? "2px dashed purple" : "2px dashed gray";

  // Helper function to create an image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  // Main function to get the cropped img
  async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = "newFile.jpeg";
        window.URL.revokeObjectURL(imageSrc); // free up memory
        resolve(window.URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  }

  const handleZoomChange = (e) => {
    setZoom(e.target.value);
  };

  const uploadAndSaveImage = async (file, uid) => {
    if (!uid) {
      console.error("No UID provided, can't upload the image");
      return;
    }

    setLoading(true); // Start loading

    // Create a unique file name
    const fileName = `user_images/${uid}/${Date.now()}-${file.name}`;
    const storageRef = ref(getStorage(), fileName);

    try {
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Get a reference to the Firestore document
      const userImagesRef = doc(db, "users", uid);

      // Set the document with the new image URL, with merging
      await setDoc(
        userImagesRef,
        {
          images: arrayUnion(downloadURL),
        },
        { merge: true }
      );

      // Update local state to display the image
      setImages((prevImages) => [...prevImages, downloadURL]);
      setLoading(false); // Finish loading after state update
    } catch (error) {
      console.error("Error during image upload:", error);
      // Log additional details if available
      if (error.code) {
        console.error("Error code:", error.code);
      }
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.serverResponse) {
        console.error("Server response:", error.serverResponse);
      }
      // Here you can add more detailed error handling based on the error code
      if (error.code === "storage/unauthorized") {
        // Unauthorized error, could be due to security rules or token expiration
        console.error(
          "This usually indicates a problem with your Firebase Security Rules"
        );
      } else if (error.code === "storage/canceled") {
        // User canceled the upload
        console.error("User canceled the upload");
      } else {
        // Unknown error, could be network issues or others
        console.error("An unknown error occurred during upload");
      }
      setLoading(false); // Finish loading on error as well
    }
  };

  const handleImageSelection = async (imageUrl) => {
    const base64ImageUrl = await fetchImageThroughProxy(imageUrl);
    // Use this base64ImageUrl as needed, for example:
    setHoodieImage(base64ImageUrl);
  };

  const fetchImageThroughProxy = async (imageUrl) => {
    try {
      // Replace 'your-netlify-function-url' with your actual Netlify function URL
      const proxyUrl = `https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy?imageUrl=${encodeURIComponent(
        imageUrl
      )}`;

      const response = await axios.get(proxyUrl);
      const data = response.data;
      return data.imageUrl; // This will be the base64 image data
    } catch (error) {
      console.error("Error fetching image through proxy:", error);
    }
  };

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        className="upload-image-input"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <button onClick={handleButtonClick} className="custom-upload-button">
        Choose File
      </button>

      <div
        className="crop-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: borderStyle,
          position: "relative",
          width: "100%",
          height: 200,
        }}
      >
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={parseFloat(zoom)}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
      </div>
      <div className="slider-container">
        <input
          type="range"
          value={zoom}
          min={1} // Set the minimum zoom level (can be less than 1 for smaller zoom)
          max={3} // Set the maximum zoom level
          step={0.1} // Set the step level for zoom precision
          onChange={handleZoomChange}
          className="zoom-slider"
        />
      </div>
      <div className="user-designs-container">
        {userImages
          .slice() // Create a copy of the array
          .reverse() // Reverse it to have the most recent images first
          .map((image, index) => (
            <div
              key={index}
              className="user-design"
              onClick={() => handleImageSelection(image)}
            >
              <img src={image} alt={`User design ${index + 1}`} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageUpload;
