import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import ImageEditor from "./ImageEditor";
import { CreateAccount } from "./CreateAccount";
// import slotsIcon from "../assets/slotsIcon.png";
// import saveIcon from "../assets/saveIcon.png";
// import screenshotIcon from "../assets/screenshotIcon.png";
// import shareIcon from "../assets/shareIcon.png";
// import helpIcon from "../assets/helpIcon.png";
// import GenieLamp from "./GenieLamp";
import GenieChat from "./GenieChat";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import UserDesigns from "./UserDesigns";
// import { motion } from "framer-motion";

// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import infoIcon from "../assets/infoIcon.png";
import genieXLogo from "../assets/genieXLogo.png";
import arrowIcon from "../assets/arrowIcon.png";
import xIcon from "../assets/xIcon.png";
import uploadImageIcon from "../assets/uploadImageIcon.png";
import genieXAssetsIcon from "../assets/genieXAssetsIcon.png";
import starsIcon from "../assets/starsIcon.png";
import savedDesignsIcon from "../assets/savedDesignsIcon.png";

// import PhotoPrompt from "./PhotoPrompt";
import PromptContainer from "./PromptContainer";
import { motion } from "framer-motion";
import InstructionalPopup from "./InstructionalPopup";
import ImageUpload from "./ImageUpload";
import AssetLibrary from "./AssetLibrary";
import saveDesignIcon from "../assets/saveDesignIcon.png";
import { Ring } from "@uiball/loaders";

import {
  // getFirestore,
  getStorage,
  ref,
  ref as firebaseStorageRef,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import ProductDetails from "./ProductDetails";
import { AnimatePresence } from "framer-motion";
import madLibsDemo from "../assets/madLibsDemo.mp4";
import freeRangeDemo from "../assets/freeRangeDemo.mp4";
import imageEditorDemo from "../assets/imageEditorDemo.mp4";
import addToCartDemo from "../assets/addToCartDemo.mp4";
import { NewHoodie } from "./NewGenieXHoodie";

// import { storage } from "../config/firebase"; // Make sure to import 'storage' from your Firebase configuration file.

// import GenieChatFreeRange from "./GenieChatFreeRange";

const TabContent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ type: "spring", stiffness: 300, damping: 30, duration: 2 }}
  >
    {children}
  </motion.div>
);

function SetupCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 9; // Set the initial position of the camera
    camera.updateProjectionMatrix();
  }, [camera]);

  return null; // This component doesn't render anything visually
}

const DesignPortal = ({
  productDetails,
  setProductDetails,
  hoodieImage,
  setHoodieImage,
  setSignedIn,
  setToggleLogInPage,
}) => {
  // console.log("In DesignPortal, setSignedIn is: ", typeof setSignedIn);

  // eslint-disable-next-line no-unused-vars
  const [isGenieChatOpen, setIsGenieChatOpen] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [dalleImages, setDalleImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [freeRangeInput, setFreeRangeInput] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false); // set this to false we want to use it again
  const [createAccountPopUp, setCreateAccountPopUp] = useState(false);

  const [maskImage, setMaskImage] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [dallePrompt, setDallePrompt] = useState("genie");
  const [tempHoodieImage, setTempHoodieImage] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Add this state for tracking saving status

  const tabs = [
    { name: "generate", icon: starsIcon },
    { name: "upload", icon: uploadImageIcon },
    { name: "assets", icon: genieXAssetsIcon },
    { name: "designs", icon: savedDesignsIcon },
  ]; // Array to map buttons with icons // Array to map buttons
  const underlineStyle = {
    width: "25%", // Since there are three tabs
    transition: { duration: 0.2 },
    x: `${tabs.findIndex((tab) => tab.name === activeTab) * 100}%`,
  };

  // const { camera } = useThree();
  // const [hoodieImage, setHoodieImage] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

  const [isGenerating, setIsGenerating] = useState(false);

  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  // useEffect(() => {
  //   console.log(hoodieImage);
  // }, [hoodieImage]);

  useEffect(() => {
    console.log("Hoodie image changes:");
  }, [hoodieImage]);

  const saveHoodieDesign = async () => {
    console.log("saving hoodie design");
    // hoodieImage ? toast("Saving to Your Collection!") : null;

    if (hoodieImage) {
      toast("Saving to Your Collection!");
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const uid = user.uid;
        const storageRef = ref(storage, `designs/${uid}/${Date.now()}.jpg`);

        await uploadString(storageRef, hoodieImage, "data_url");
        const downloadURL = await getDownloadURL(storageRef);

        const designData = {
          image: downloadURL,
          createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, "users", uid, "designs"), designData);

        toast("Added to Your Collection!");
      } catch (error) {
        console.error("Error saving hoodie design:", error);
        toast("You need to make a design first!");
      }
    } else {
      toast("You Need to Login First!");
      console.log("User is not authenticated or logged in.");
    }
  };

  // useEffect(() => {
  //   console.log(productDetails);
  // }, [productDetails]);

  const [freeRangeToggle, setFreeRangeToggle] = useState(false);
  const [freeRangePrompt, setFreeRangePrompt] = useState("a blue genie");

  const [isFreeRange, setIsFreeRange] = useState(false);
  const [triggerCounter, setTriggerCounter] = useState(0);

  const toggleSwitch = () => setFreeRangeToggle(!freeRangeToggle);

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  const generateFreeRangeImage = () => {
    setTriggerCounter((prev) => prev + 1); // Increment the counter
    setIsFreeRange(true);
    setFreeRangeInput(!freeRangeInput);
    console.log("testing image");
    setHoodieImage("free");
  };

  useEffect(() => {
    if (tempHoodieImage === true) {
      console.log("new image generating");
      if (dalleImages.length > 0) {
        applyImage();
      }
    } else {
      // setHoodieImage(tempHoodieImage);
      console.log("apply image not working");
    }
    setTempHoodieImage(false);
  }, [dalleImages, selectedImageIndex, hoodieImage]);

  const generateImage = useCallback(
    async (currentIsFreeRange) => {
      // selectReplacement();
      console.log("IsFreeRange: ", currentIsFreeRange);
      setIsGenerating(true);
      console.log("generating image");
      const res = await openai.createImage({
        model: "dall-e-3",
        prompt: currentIsFreeRange === true ? freeRangePrompt : dallePrompt,
        n: 1, // Request 4 images
        size: "1024x1024",
        // quality: "hd",
        style: "natural",
      });

      console.log("isFreeRange", isFreeRange);

      console.log(dallePrompt);

      const generatedImages = res.data.data.map((img) => img.url);
      console.log(generatedImages);

      if (generatedImages.length === 0) {
        setDalleImages([hoodieImage]); // Set to hoodieImage if empty
      } else {
        setDalleImages(generatedImages); // Store all image URLs
        setTempHoodieImage(true);
        setHoodieImage(generatedImages[0]); // Set hoodieImage to the first dalleImage
      }

      setIsGenerating(false);
    },

    [
      dallePrompt,
      openai,
      hoodieImage,
      freeRangePrompt,
      freeRangeToggle,
      isFreeRange,
    ]
  ); // Note: I've added hoodieImage as a dependency
  // const generateEdit = useCallback(async () => {
  //   console.log("generating edit");
  //   const res = await openai.createImageEdit({
  //     image: hoodieImage,
  //     mask: maskImage,
  //     prompt: editPrompt,
  //   });

  //   console.log(res);

  //   console.log(res.data.data.map((img) => img.url));
  // });

  // useEffect(() => {
  //   if (hoodieImage !== false) {
  //     return;
  //   } else {
  //     setDalleImages([]);
  //     if (dalleImages.length === 0) {
  //       setDalleImages([hoodieImage]);
  //       // Only generate if no images have been generated yet
  //       // generateImage();
  //     }
  //   }
  // }, []); // Empty dependency array ensures this useEffect runs only once when the component mounts

  const applyImage = async () => {
    toast("Applying Design to Hoodie!");

    // Check if there are any images to process
    if (dalleImages.length === 0) {
      console.error("No images to apply.");
      return;
    }

    try {
      // Process the first image in the array (you can adjust this as needed)
      const response = await axios.get(
        "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy",
        {
          params: {
            imageUrl: dalleImages[selectedImageIndex], // Pass the first OpenAI image URL as a parameter
          },
        }
      );

      // Handle the response and update the hoodie image state
      setHoodieImage(response.data.imageUrl);
      // console.log(response.data.imageUrl);
    } catch (error) {
      // console.log("test", dalleImages[selectedImageIndex]);
      // console.error("Error while downloading the image:", error);
    }
  };

  const generateImageCheck = () => {
    setHoodieImage("generate");
    setIsFreeRange(false);
    generateImage(false);
    console.log("generate image clicked");
  };

  const addToCart = async () => {
    if (!hoodieImage) {
      console.error("hoodieImage is undefined");
      return;
    }

    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    console.log("uploaded hoodieImage", hoodieImage);

    try {
      // Fetch the Blob from the hoodieImage URL
      const response = await fetch(hoodieImage);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storage = getStorage();
      const imageName = `${Date.now()}.jpg`; // Using the timestamp as part of the image name
      const storageReference = firebaseStorageRef(
        storage,
        `user_images/${auth.currentUser.uid}/${imageName}`
      );

      await uploadBytes(storageReference, blob);

      // Get download URL and save to Firestore
      const downloadURL = await getDownloadURL(storageReference);

      // Create a unique ID for the cart item, could also use a UUID library
      const uniqueCartItemId = uuidv4();

      const hoodieData = {
        id: uniqueCartItemId,
        imageUrl: downloadURL,
        addedAt: new Date(),
        size: "L",
        price: 120,
        quantity: 1, // Start with a quantity of 1 when added to the cart
      };

      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      const docSnapshot = await getDoc(userCartRef);

      if (docSnapshot.exists()) {
        let data = docSnapshot.data();
        let currentItems = data ? data.items || [] : [];
        // Check if the item already exists in the cart based on imageUrl
        const existingItemIndex = currentItems.findIndex(
          (item) => item.imageUrl === hoodieData.imageUrl
        );
        if (existingItemIndex !== -1) {
          // If item exists, update the quantity
          currentItems[existingItemIndex].quantity += 1;
        } else {
          // If item is new, add it to the cart
          currentItems.push(hoodieData);
        }
        await setDoc(userCartRef, { items: currentItems }, { merge: true });
      } else {
        // If the cart does not exist, create it with the new item
        await setDoc(userCartRef, { items: [hoodieData] });
      }

      console.log("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const saveDesign = async () => {
    if (!hoodieImage) {
      console.error("No design to save.");
      return;
    }

    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    setIsSaving(true); // Start saving

    try {
      // Use hoodieImage as it is already in base64 format or get the image Blob/File

      // Convert base64 to Blob if needed (otherwise, use the file directly)
      const byteCharacters = atob(hoodieImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: "image/jpeg" });

      // Upload to Firebase Storage under 'saved-designs' folder
      const storageRef = firebaseStorageRef(
        storage,
        `saved-designs/${auth.currentUser.uid}/${Date.now()}.jpg`
      );
      await uploadBytes(storageRef, imageBlob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save the reference to Firestore
      const designsRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "saved-designs"
      );
      await addDoc(designsRef, { imageUrl: downloadURL, savedAt: new Date() });

      console.log("Design saved successfully!");
    } catch (error) {
      console.error("Error saving the design:", error);
    }
    setIsSaving(false); // Finish saving
  };

  const [words, setWords] = useState({
    Subject: "Subject",
    Adjective: "Adjective",
    Setting: "Setting",
    Verb: "Verb",
    Style: "Style",
    Composition: "Composition",
    ColorScheme: "Color",
    Medium: "Painting ",
  });

  useEffect(() => {
    // Updating the Dalle prompt when words change
    const newDallePrompt = `${words.Style} style ${words.Medium} of ${words.Subject} ${words.Verb} in ${words.Setting} with a ${words.ColorScheme} color scheme`;
    setDallePrompt(newDallePrompt);
  }, [words]); // This useEffect will run whenever the 'words' state changes

  return (
    <div style={{ height: "100vh" }} className="design-portal-container">
      <AnimatePresence>
        {instructionsOpen || editPopup ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)", // semi-transparent black
              zIndex: 1000, // Adjust as needed, should be less than the z-index of InstructionalPopup
            }}
          />
        ) : null}
      </AnimatePresence>
      {/* <div className="design-portal-container">
        <img alt="icons" src={slotsIcon} className="lottery-btn" />
        <img
          alt="icons"
          src={saveIcon}
          onClick={saveHoodieDesign}
          className="design-portal-btn"
        />
        <ToastContainer />
        <img alt="icons" src={screenshotIcon} className="design-portal-btn" />
        <img alt="icons" src={shareIcon} className="design-portal-btn" />
        <img alt="icons" src={helpIcon} className="design-portal-btn" />
      </div> */}
      {/* <div className="checkout-btn-container">
        <Link className="">Checkout</Link>
        <Link to="collection">My Collection</Link>
      </div> */}

      <AnimatePresence>
        {instructionsOpen ? (
          <div className="instructions-container">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InstructionalPopup
                setInstructionsOpen={setInstructionsOpen}
                instructionsOpen={instructionsOpen}
                createAccountPopUp={createAccountPopUp}
                setCreateAccountPopUp={setCreateAccountPopUp}
                setSignedIn={setSignedIn}
                setToggleLogInPage={setToggleLogInPage}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="hoodie_canvas">
        <div className="hoodie-canvas-left">
          <h3
            onClick={() => {
              setProductDetails(true);
              console.log(productDetails);
            }}
            className="product-details-button"
          >
            <img width={20} src={infoIcon} alt="info" />
            Product Details{" "}
          </h3>
          <div className="hoodie-scene">
            <Canvas>
              <SetupCamera />
              {/* <Hoodie hoodieImage={hoodieImage} /> */}
              <NewHoodie genieXLogo={genieXLogo} hoodieImage={hoodieImage} />
              <OrbitControls
                enablePan={true}
                target={[0, 0.8, 0]}
                zoomSpeed={0.5}
                maxDistance={13}
                minDistance={4}
              />
              <Environment preset="city" />
              <ambientLight intensity={0.2} />
              {/* <directionalLightHelper /> */}
            </Canvas>
            <div className="free-range-input-container">
              <input
                className="free-range-input"
                placeholder="Type in a detailed description..."
                // disabled={!freeRangeToggle}
                style={{
                  backgroundColor: `${
                    !freeRangeToggle
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.4)"
                  }`,
                }}
                onChange={(e) => setFreeRangePrompt(e.target.value)}
              ></input>
              <button
                className="generate-image-free-range-btn"
                onClick={generateFreeRangeImage}
                // disabled={dallePrompt === "genie"}
              >
                Generate
              </button>
            </div>

            {/* <div
              className="switch"
              data-isOn={freeRangeToggle}
              onClick={toggleSwitch}
              style={{
                position: "absolute",
                margin: "1rem",
                backgroundColor: `${
                  !freeRangeToggle ? "rgba(255, 255, 255, 0.4)" : "#2685e3"
                } `,
              }}
            >
              <motion.div className="handle" layout transition={spring} />
            </div> */}
            <div
              style={{
                position: "absolute",
                left: 10,
                bottom: 0,
                // padding: "2rem",
              }}
            >
              <p>
                <em>
                  <b>Orbit</b>
                </em>{" "}
                - Click + Drag
              </p>
              <p>
                <em>
                  <b>Zoom</b>
                </em>{" "}
                - Scroll
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <div className="tab-buttons">
          <div className="tab-container">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={activeTab === tab.name ? "active" : ""}
                onClick={() => setActiveTab(tab.name)}
              >
                <img
                  style={{
                    width: "40px",

                    padding: "2px",
                  }}
                  src={tab.icon}
                  alt={tab.name}
                />
              </button>
            ))}
          </div>
          {/* Underline element */}
          <motion.div
            className="underline-2"
            initial={false}
            animate={underlineStyle}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "generate" && (
            <TabContent key="generate">
              <PromptContainer
                setWords={setWords}
                words={words}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                triggerCounter={triggerCounter}
                isFreeRange={isFreeRange}
                setIsFreeRange={setIsFreeRange}
                freeRangeInput={freeRangeInput}
                editPrompt={editPrompt}
                maskImage={maskImage}
                hoodieImage={hoodieImage}
                dalleImages={dalleImages}
                setDalleImages={setDalleImages}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                setEditPopup={setEditPopup}
                editPopup={editPopup}
                setHoodieImage={setHoodieImage}
                freeRangeToggle={freeRangeToggle}
                setFreeRangeToggle={setFreeRangeToggle}
                freeRangePrompt={freeRangePrompt}
              />
            </TabContent>
          )}

          {activeTab === "upload" && (
            <TabContent key="upload">
              <ImageUpload setHoodieImage={setHoodieImage} />
            </TabContent>
          )}

          {activeTab === "assets" && (
            <TabContent key="assets">
              <AssetLibrary setHoodieImage={setHoodieImage} />
            </TabContent>
          )}

          {activeTab === "designs" && (
            <TabContent key="designs">
              <UserDesigns setHoodieImage={setHoodieImage} />
            </TabContent>
          )}
        </AnimatePresence>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, .6)",
            borderBottomRightRadius: "1rem",
            height: "36px",
            paddingTop: ".5rem",
            paddingBottom: ".5rem",
          }}
        >
          <div
            className="prompt-buttons-container"
            style={{
              position: "absolute",
              zIndex: 10000,
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <button
              // className="apply-image-btn"
              onClick={generateImageCheck}
              className="prompt-button"
              style={{
                marginTop: "0",
                width: "10px",
                fontFamily: "oatmeal-pro-bold",
                padding: ".7rem",
                borderRadius: ".5rem",
                transition: "all .2s ease-in-out",
                cursor: "pointer",
                fontSize: "15px",
                // boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.3)",
              }}
              // disabled={dallePrompt === "genie"}
            >
              Generate
            </button>
            <Link
              className="prompt-button"
              to={"/cart"}
              // className="apply-image-btn"
              onClick={addToCart}
              style={{
                backgroundColor: "black",
                transition: "all .2s ease-in-out ",
              }}
            >
              <button
                style={{
                  border: "none",
                  backgroundColor: "black",
                  // boxShadow: "5px 13px 5px rgba(0, 0, 0, 0.3)",
                  fontFamily: "oatmeal-pro-regular",
                  cursor: "pointer",
                  color: "white",
                  fontFamily: "oatmeal-pro-bold",
                  fontSize: "15px",
                  borderRadius: "1rem",
                  // boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.3)",
                }}
              >
                Add to Cart
              </button>
            </Link>
            <button
              className="save-design-button"
              style={{
                border: "none",
                background: "white",
                boxShadow: "none",
                fontFamily: "oatmeal-pro-regular",
                borderRadius: ".5rem",
                // marginTop: "1rem",
                maxWidth: "50px",
              }}
              onClick={saveDesign}
            >
              {isSaving ? (
                <Ring size={20} lineWeight={5} speed={2} color="black" />
              ) : (
                <img
                  src={saveDesignIcon}
                  alt="save"
                  style={{
                    height: "20px",
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* <motion.div className="genie-lamp-canvas">
        <Canvas>
          <GenieLamp toggleGenieChat={toggleGenieChat} />
          <Environment preset="city" />
        </Canvas> 
      </motion.div> */}
      {/* <GenieChat isOpen={isOpen} /> */}

      {editPopup && (
        <AnimatePresence>
          <ImageEditor
            setMaskImage={setMaskImage}
            maskImage={maskImage}
            setEditPrompt={setEditPrompt}
            editPrompt={editPrompt}
            hoodieImage={hoodieImage}
            setHoodieImage={setHoodieImage}
            dalleImages={dalleImages}
            setDalleImages={setDalleImages}
            setSelectedImageIndex={setSelectedImageIndex}
            selectedImageIndex={selectedImageIndex}
            editPopup={editPopup}
            setEditPopup={setEditPopup}
          />
        </AnimatePresence>
      )}

      {isGenieChatOpen && (
        <GenieChat
          setHoodieImage={setHoodieImage}
          // toggleGenieChat={toggleGenieChat}
          isGenieChatOpen={isGenieChatOpen}
          hoodieImage={hoodieImage}
        />
      )}
      {/* <GenieChat /> */}
    </div>
  );
};

export default DesignPortal;
