import ReactDOM from "react-dom";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import infoIcon from "../assets/infoIcon.png";
import { Link } from "react-router-dom";
import ImageEditor from "./ImageEditor";
import { auth, db } from "../config/firebase";
import { Ring } from "@uiball/loaders";

// import { motion, AnimatePresence } from "framer-motion";
// import ImageEditor from "./ImageEditor";
import lockIcon from "../assets/lockIcon.png";
import previewThumbnail from "../assets/previewThumbnail.png";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref as firebaseStorageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const PhotoPrompt = ({
  isFreeRange,
  setIsFreeRange,
  freeRangeInput,
  maskImage,
  editPrompt,
  dalleImages,
  setDalleImages,
  selectedImageIndex,
  setSelectedImageIndex,
  setHoodieImage,
  editPopup,
  setEditPopup,
  hoodieImage,
  freeRangeToggle,
  setFreeRangeToggle,
  freeRangePrompt,
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState({
    Subject: "Subject",
    Adjective: "Adjective",
    Setting: "Setting",
    Verb: "Verb",
    Style: "Style",
    Composition: "Composition",
    ColorScheme: "X",
    Medium: "Photograph ",
  });

  useEffect(() => {
    console.log("hoodie IMAGE:", hoodieImage);
  });

  useEffect(() => {
    if (freeRangePrompt === "a blue genie") {
      return;
    } else {
      generateImage(isFreeRange);
    }
  }, [isFreeRange]);

  const [isGenerating, setIsGenerating] = useState(false);

  const portalRoot = document.getElementById("portal-root");
  const dropdownRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedImage, setSelectedImage] = useState(""); // Add this state variable
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [showDropdown, setShowDropdown] = useState(false); // Add this state variable

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  // const [dalleImages, setDalleImages] = useState([]);
  const [dallePrompt, setDallePrompt] = useState("genie");

  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef(null);

  const replacements = {
    Subject: [
      "Wizard with a gold staff",
      "Scientist in a red lab coat",
      "Assassin holding two daggers",
      "Aztec with a spiked necklace made of bones",
      "Roman Soldier with gold trimmed armor",
      "Monkey in a business suit",
      "Robot",
      "Ghost",
      "Spaceship",
      "Car",
      "Cat",
      "Bicycle",
      "Tree",
      "Mountain",
      "River",
      "Sky",
      "Computer",
      "Chair",
      "Book",
      "Pencil",
      "Shoe",
      "Shirt",
      "Bird",
      "Flower",
      "Grass",
      "Cloud",
      "Moon",
      "Sun",
      "Star",
      "Planet",
      "Fish",
      "Ocean",
      "Lake",
      "Forest",
      "Bee",
      "Bear",
      "Lion",
      "Tiger",
      "Elephant",
      "Ant",
      "Aeroplane",
      "Train",
      "Boat",
      "Island",
      "Canyon",
      "Desert",
      "Rainbow",
      "Snowflake",
      "Pineapple",
      "Apple",
      "Banana",
      "Grape",
      "Orange",
      "Lemon",
      "Cherry",
      "Strawberry",
      "Blueberry",
      "Raspberry",
      "Kiwi",
      "Watermelon",
      "Mango",
      "Peach",
      "Pear",
      "Plum",
      "Pomegranate",
      "Guitar",
      "Piano",
      "Drum",
      "Flute",
      "Violin",
      "Trumpet",
      "Saxophone",
      "Microphone",
      "Camera",
      "Television",
      "Refrigerator",
      "Oven",
      "Microwave",
      "Lamp",
      "Candle",
      "Fire",
      "Spoon",
      "Knife",
      "Fork",
      "Bowl",
      "Plate",
      "Glass",
      "Mug",
      "Cup",
      "Bottle",
      "Can",
      "Bag",
      "Box",
      "Pen",
      "Notebook",
      "Backpack",
      "Clock",
      "Watch",
      "Phone",
      "Tablet",
      "Laptop",
      "Headphone",
      "Speaker",
      "Printer",
      "Router",
      "Mouse",
      "Keyboard",
      "Screen",
      "Window",
      "Door",
      "Roof",
      "Wall",
      "Floor",
      "Stairs",
      "Elevator",
      "Escalator",
    ],
    Adjective: [
      "Happy",
      "Tall",
      "Bright",
      "Sad",
      "Short",
      "Dark",
      "Joyful",
      "Massive",
      "Dim",
      "Angry",
      "Thin",
      "Luminous",
      "Cheerful",
      "Heavy",
      "Gloomy",
      "Content",
      "Smooth",
      "Shiny",
      "Depressed",
      "Rough",
      "Matte",
      "Ecstatic",
      "Soft",
      "Sharp",
      "Melancholic",
      "Hard",
      "Blurry",
      "Elated",
      "Sticky",
      "Clear",
      "Morose",
      "Slippery",
      "Transparent",
      "Optimistic",
      "Slick",
      "Opaque",
      "Pessimistic",
      "Fluffy",
      "Solid",
      "Exuberant",
      "Tight",
      "Liquid",
      "Despondent",
      "Loose",
      "Frozen",
      "Vivacious",
      "Rigid",
      "Boiling",
      "Sullen",
      "Flexible",
      "Cold",
      "Jovial",
      "Large",
      "Hot",
      "Mournful",
      "Tiny",
      "Warm",
      "Jubilant",
      "Huge",
      "Cool",
      "Woeful",
      "Petite",
      "Tepid",
      "Buoyant",
      "Giant",
      "Frigid",
      "Downcast",
      "Miniature",
      "Lukewarm",
      "Radiant",
      "Vast",
      "Scalding",
      "Gleeful",
      "Expansive",
      "Icy",
      "Mirthful",
      "Spacious",
      "Chilly",
      "Blissful",
      "Narrow",
      "Toasty",
      "Delighted",
      "Broad",
      "Blazing",
      "Hopeful",
      "Wide",
      "Sizzling",
      "Desolate",
      "Slim",
      "Steamy",
      "Jolly",
      "Thick",
      "Humid",
      "Dismal",
      "Shallow",
      "Dry",
    ],
    Verb: [
      "Playing Chess",
      "Jumping over the moon",
      "Running from a zombie",
      "Riding a horse",
      "Eating a gold pizza",
      "Crying",
      "Laughing",
      "Eating",
    ],
    Setting: [
      "a destroyed castle covered in rubble",
      "A tropical beach with palm trees",
      "a mountain on mars",
    ],
    Style: [
      "Renaissance",
      "Cubism",
      "Impressionist",
      "Punk",
      "Abstract",
      "Monochrome",
      "Vintage",
      "HDR",
    ],
    Composition: ["Rule of Thirds", "Centered", "Diagonal"],
    ColorScheme: [
      "Red",
      "Blue",
      "Yellow",
      "Vibrant",
      "Colorful",
      "Warm",
      "Cool",
      "Happy",
      "Dark",
    ],
    Medium: [
      "Photograph ",
      "Painting ",
      "3D Render ",
      "Sculpture ",
      "Drawing ",
    ],
  };

  const handleClick = (key, event, place) => {
    if (showDropdown) {
      setInputValue(""); // Clear the input value when a new dropdown is opened
    }
    const rect = event.target.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.bottom,
    });
    setSelectedWord(key);
    setPlaceholder(place);
    setShowDropdown(true);

    focusInput(); // Focus on the input every time a dropdown is clicked
  };

  const handleOutsideClick = useCallback(
    (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedWord(null);
        setInputValue("");
      }
    },
    [showDropdown]
  );

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (showDropdown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showDropdown]);

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDropdown, handleOutsideClick]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setWords((prevWords) => ({
      ...prevWords,
      [selectedWord]: e.target.value,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setShowDropdown(false);
      setSelectedWord(null);

      setInputValue(""); // Clear the input value when the return key is pressed
    }
  };

  const selectReplacement = (key, replacement) => {
    setWords((prevWords) => {
      const updatedWords = {
        ...prevWords,
        [key]: replacement,
      };

      const newDallePrompt = `${updatedWords.Style} style ${updatedWords.Medium}  of ${updatedWords.Subject} ${updatedWords.Verb} in ${updatedWords.Setting} with a ${updatedWords.ColorScheme} color scheme`;

      console.log("setting new dalle prompt");
      setDallePrompt(newDallePrompt);

      return updatedWords;
    });
    setSelectedWord(null);
    setShowDropdown(false); // Hide the dropdown when an item is selected
    setInputValue(""); // Clear the input value when an item is selected
  };

  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  const generateImageCheck = () => {
    setIsFreeRange(false);
    generateImage(false);
  };

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

      console.log(dallePrompt);

      const generatedImages = res.data.data.map((img) => img.url);
      console.log(generatedImages);

      if (generatedImages.length === 0) {
        setDalleImages([hoodieImage]); // Set to hoodieImage if empty
      } else {
        setDalleImages(generatedImages); // Store all image URLs
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

  useEffect(() => {
    if (dalleImages.length === 0) {
      setDalleImages([hoodieImage]);
      // Only generate if no images have been generated yet
      // generateImage();
    }
  }, []); // Empty dependency array ensures this useEffect runs only once when the component mounts

  const applyImage = async () => {
    console.log("test");
    toast("Applying Design to Hoodie!");

    // Check if there are any images to process
    if (dalleImages.length === 0) {
      console.error("No images to apply.");
      return;
    }

    console.log("test", dalleImages[selectedImageIndex]);

    try {
      console.log("test", dalleImages[selectedImageIndex]);
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
      console.log(response.data.imageUrl);
    } catch (error) {
      console.log("test", dalleImages[selectedImageIndex]);
      console.error("Error while downloading the image:", error);
    }
  };

  useEffect(() => {
    if (dalleImages.length > 0) {
      applyImage();
    }
  }, [dalleImages, selectedImageIndex]);

  const handleImageClick = (src, index) => {
    setSelectedImage(src);
    setSelectedImageIndex(index);
    setHoodieImage(src); // This will set the hoodie image to the clicked image
    console.log(src, index);
  };

  // const handleCloseImage = () => {
  //   setSelectedImage("");
  // };

  const storage = getStorage();
  // const storageReference = storageRef(storage, "path/to/your/image.jpg");

  // const imageRef = storageRef(storage, "path/to/your/image.jpg"); // Use storageRef here

  const addToCart = async () => {
    if (!hoodieImage) {
      console.error("hoodieImage is undefined");
      return;
    }

    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    console.log(auth);

    try {
      // Convert base64 to Blob
      const byteCharacters = atob(hoodieImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Upload to Firebase Storage
      const storage = getStorage();
      const storageReference = firebaseStorageRef(
        storage,
        `user_images/${auth.currentUser.uid}/${Date.now()}.jpg`
      ); // Updated the path to be dynamic based on user and timestamp

      await uploadBytes(storageReference, blob); // Upload the blob to Firebase Storage

      // Get download URL and save to Firestore
      const downloadURL = await getDownloadURL(storageReference);

      const hoodieData = {
        imageUrl: downloadURL,
        addedAt: new Date(),
      };

      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      const docSnapshot = await getDoc(userCartRef);

      if (docSnapshot.exists()) {
        let data = docSnapshot.data();
        let currentItems = data ? data.items || [] : [];
        currentItems.push(hoodieData);
        await setDoc(userCartRef, { items: currentItems }, { merge: true });
      } else {
        await setDoc(userCartRef, { items: [hoodieData] });
      }

      console.log("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeWord = useCallback((key) => {
    setWords((prevWords) => {
      return { ...prevWords, [key]: "" }; // Set the word to an empty string instead of deleting it
    });
  }, []);

  useEffect(() => {
    // Updating the Dalle prompt when words change
    const newDallePrompt = `${words.Style} style ${words.Medium} of ${words.Subject} ${words.Verb} in ${words.Setting} with a ${words.ColorScheme} color scheme`;
    setDallePrompt(newDallePrompt);
  }, [words]); // This useEffect will run whenever the 'words' state changes

  return (
    <div ref={ref} className="prompt-content-container">
      <div className="info-icon-container">
        <img src={infoIcon} width="20px" alt="infoIcon"></img>
        <p
          style={{
            color: "black",
            opacity: 1,
            fontFamily: "oatmeal-pro-regular",
          }}
        >
          click colored words to replace them...
        </p>
      </div>
      <div
        className="madlibs-container"
        style={{ textAlign: "left", lineHeight: "4rem" }}
      >
        {words.Style && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("Style", e, "Style")}
              >
                {words.Style}
              </span>
              <span
                // style={{ color: "red", cursor: "pointer" }}
                className="remove-word"
                onClick={() => removeWord("Style")}
              >
                x
              </span>
            </div>
            {" + "}
          </>
        )}

        {words.Medium && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("Medium", e, "Medium")}
              >
                {words.Medium}
              </span>
              <span
                onClick={() => removeWord("Medium")}
                className="remove-word"
              >
                x
              </span>
            </div>
            {" of "}
          </>
        )}

        {words.Subject && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("Subject", e, "Person or thing")}
              >
                {words.Subject}
              </span>
              <span
                className="remove-word"
                onClick={() => removeWord("Subject")}
              >
                x
              </span>
            </div>
            {" + "}
          </>
        )}

        {words.Verb && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("Verb", e, "Action")}
              >
                {words.Verb}
              </span>
              <span className="remove-word" onClick={() => removeWord("Verb")}>
                x
              </span>
            </div>
            {" in "}
          </>
        )}

        {words.Setting && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("Setting", e, "Place")}
              >
                {words.Setting}
              </span>
              <span
                className="remove-word"
                onClick={() => removeWord("Setting")}
              >
                x
              </span>
            </div>
            {" + "}
          </>
        )}

        {words.ColorScheme && (
          <>
            <div className="clickable-wrapper">
              <span
                className="clickable"
                style={{ color: "#5300FF" }}
                onClick={(e) => handleClick("ColorScheme", e, "Color scheme")}
              >
                {words.ColorScheme}
              </span>
              <span
                className="remove-word"
                onClick={() => removeWord("ColorScheme")}
              >
                x
              </span>
            </div>
            {" color scheme"}
          </>
        )}
      </div>

      {selectedWord &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="dropdown"
            style={{
              position: "fixed",
              left: position.x,
              top: position.y,
            }}
          >
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder={`${placeholder}...`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {replacements[selectedWord].map((replacement, index) => (
              <div
                key={index}
                onClick={() => {
                  selectReplacement(selectedWord, replacement);
                  setInputValue(""); // Clear the input value after selection
                }}
              >
                {replacement}
              </div>
            ))}
          </div>,
          portalRoot // Added the portalRoot reference here
        )}

      {/* <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, x: "-30vw" }}
            animate={{ opacity: 1, x: "-30vw" }}
            exit={{ opacity: 0 }}
            // onClick={handleCloseImage}
            style={{
              position: "fixed",
              // top: 0,
              // left: 0,
              // right: 0,
              // bottom: 0,
              width: "50rem",
              height: "50rem",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              zIndex: 1000,
              boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            <motion.div
              // src={selectedImage}
              initial={{ scale: 0.5 }}
              animate={{ scale: 0.8 }}
              exit={{ scale: 0.5 }}
              style={{
                // maxHeight: "80vh",
                // maxWidth: "80vh",
                // objectFit: "contain",
                borderRadius: "2rem",
              }}
            >
              <ImageEditor selectedImage={selectedImage} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* THIS SECTION IS FOR THE 4 IMAGE FEATURE */}
      {/* <div className="preview-images-container">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="preview-image-container"
              style={{
                border:
                  selectedImageIndex === index ? "2px solid #5300FF" : "none",
              }}
            >
              {dalleImages[index] ? (
                <div style={{ width: "100%", height: "100%" }}>
                  {selectedImageIndex === index && (
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditPopup(true);
                        console.log("edit popup opening");
                        console.log(typeof setEditPopup);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <img
                    src={dalleImages[index]}
                    className="preview-image"
                    alt={`previewImage-${index}`}
                    style={{
                      borderRadius: "1rem",
                      width: "100%",
                    }}
                    onClick={() => handleImageClick(dalleImages[index], index)}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                  }}
                ></div>
              )}
            </div>
          ))}
      </div> */}
      <div className="preview-images-container">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="preview-image-container"
              style={{
                border:
                  selectedImageIndex === index ? "2px solid #5300FF" : "none",
              }}
            >
              {index === 0 ? (
                isGenerating ? (
                  <div
                    style={{
                      width: "30%",
                      height: "30%",
                      marginTop: "70%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ring
                      size={40}
                      lineWeight={5}
                      speed={2}
                      color="black"
                      style={{ marginTop: "2rem" }}
                    />
                  </div>
                ) : (
                  dalleImages[0] && (
                    <div style={{ width: "100%", height: "100%" }}>
                      {selectedImageIndex === index && (
                        <button
                          className="edit-button"
                          onClick={() => {
                            setEditPopup(true);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <img
                        src={hoodieImage}
                        className="preview-image"
                        alt={`previewImage-${index}`}
                        style={{
                          borderRadius: "1rem",
                          width: "100%",
                        }}
                        onClick={() =>
                          handleImageClick(dalleImages[index], index)
                        }
                      />
                    </div>
                  )
                )
              ) : (
                <div
                  style={{
                    width: "30%",
                    height: "30%",
                    marginTop: "60%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    className="preview-image lock-icon"
                    src={lockIcon}
                    alt="locked"
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="prompt-buttons-container">
        <button
          className="apply-image-btn"
          onClick={generateImageCheck}
          disabled={dallePrompt === "genie"}
        >
          Generate Image
        </button>
        <Link to={"/cart"} className="apply-image-btn" onClick={addToCart}>
          <button
            style={{
              border: "none",
              background: "white",
              boxShadow: "none",
              fontFamily: "oatmeal-pro-regular",
            }}
          >
            Add to Cart
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PhotoPrompt;
