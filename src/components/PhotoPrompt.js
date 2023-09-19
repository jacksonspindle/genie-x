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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import infoIcon from "../assets/infoIcon.png";
import { motion, AnimatePresence } from "framer-motion";
import ImageEditor from "./ImageEditor";

const PhotoPrompt = ({ setHoodieImage }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState({
    Subject: "Subject",
    Adjective: "Adjective",
    Setting: "Setting",
    Verb: "Verb",
    Style: "Style",
    Composition: "Composition",
    ColorScheme: "X",
  });

  const portalRoot = document.getElementById("portal-root");
  const dropdownRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(""); // Add this state variable
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [showDropdown, setShowDropdown] = useState(false); // Add this state variable

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const [dalleImages, setDalleImages] = useState([]);
  const [dallePrompt, setDallePrompt] = useState(
    "Photograph of Adjective + Subject Verb in Setting + Style + Composition with a Color Scheme"
  );

  const replacements = {
    Subject: [
      "Dog",
      "Building",
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
    Verb: ["Running", "Fighting", "Eating"],
    Setting: ["Park", "Street", "Beach"],
    Style: ["Monochrome", "Vintage", "HDR"],
    Composition: ["Rule of Thirds", "Centered", "Diagonal"],
    ColorScheme: ["Warm", "Cool", "Monochromatic"],
  };

  const handleClick = (key, event) => {
    const rect = event.target.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.bottom,
    });
    setSelectedWord(key);
    setShowDropdown(true);
  };

  const handleOutsideClick = (event) => {
    if (
      showDropdown &&
      ref.current &&
      !ref.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
      setSelectedWord(null);
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDropdown]);

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
    }
  };

  const selectReplacement = (key, replacement) => {
    setWords((prevWords) => {
      const updatedWords = {
        ...prevWords,
        [key]: replacement,
      };

      const newDallePrompt = `${updatedWords.Style} photograph of ${updatedWords.Adjective} + ${updatedWords.Subject} ${updatedWords.Verb} in ${updatedWords.Setting} + ${updatedWords.Composition} with a ${updatedWords.ColorScheme} color scheme`;

      setDallePrompt(newDallePrompt);

      return updatedWords;
    });
    setSelectedWord(null);
    setShowDropdown(false); // Hide the dropdown when an item is selected
  };

  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  useEffect(() => {
    if (dalleImages.length > 0) {
      applyImage();
    }
  }, [dalleImages, selectedImageIndex]);

  const generateImage = useCallback(async () => {
    console.log("generating image");
    const res = await openai.createImage({
      prompt: dallePrompt,
      n: 4, // Request 4 images
      size: "1024x1024",
    });

    console.log(res.data.data.map((img) => img.url));
    setDalleImages(res.data.data.map((img) => img.url)); // Store all 4 image URLs
  }, [dallePrompt, openai]);

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

  const handleImageClick = (src, index) => {
    setSelectedImage(src);
    setSelectedImageIndex(index);
    setHoodieImage(src); // This will set the hoodie image to the clicked image
    console.log(src, index);
  };

  const handleCloseImage = () => {
    setSelectedImage("");
  };

  return (
    <div ref={ref} className="prompt-content-container">
      <div className="info-icon-container">
        <img src={infoIcon} width="20px" alt="infoIcon"></img>
        <p>click colored words to replace them...</p>
      </div>
      <h1 style={{ textAlign: "left" }}>
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Style", e)}
        >
          {words.Style}
        </span>{" "}
        photograph of{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Adjective", e)}
        >
          {words.Adjective}
        </span>{" "}
        +{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Subject", e)}
        >
          {words.Subject}
        </span>{" "}
        +{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Verb", e)}
        >
          {words.Verb}
        </span>{" "}
        in{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Setting", e)}
        >
          {words.Setting}
        </span>{" "}
        +{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("Composition", e)}
        >
          {words.Composition}
        </span>{" "}
        with a{" "}
        <span
          className="clickable"
          style={{ color: "#5300FF" }}
          onClick={(e) => handleClick("ColorScheme", e)}
        >
          {words.ColorScheme}
        </span>{" "}
        color scheme
      </h1>
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
              className="search-input"
              type="text"
              placeholder={`Update ${selectedWord}...`}
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
              {dalleImages[index] ? (
                <img
                  src={dalleImages[index]}
                  className="preview-image"
                  alt={`previewImage-${index}`}
                  onClick={() => handleImageClick(dalleImages[index], index)}
                />
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
      </div>

      <div className="prompt-buttons-container">
        <button className="apply-image-btn" onClick={generateImage}>
          Generate Image
        </button>
        <button className="apply-image-btn" onClick={generateImage}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default PhotoPrompt;
