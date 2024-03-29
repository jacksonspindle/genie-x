import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import penIcon from "../assets/penIcon.png";
import eraserIcon from "../assets/eraserIcon.png";
import helpIcon from "../assets/helpIcon.png";
import noteIcon from "../assets/noteIcon.png";
import genieIcon from "../assets/genieIcon.png";
import penCursor from "../assets/penCursor.png";
import { Configuration, OpenAIApi } from "openai";
import { motion } from "framer-motion";
import { Ring } from "@uiball/loaders";
import MyImageEditor from "../components/MyImageEditor";

import xIcon from "../assets/xIcon.png";
import clearIcon from "../assets/clearIcon.png";
import textIcon from "../assets/textIcon.png";
import scissorsIcon from "../assets/scissorsIcon.png";

const ImageCanvas = ({
  setHoodieImage,
  maskImage,
  setMaskImage,
  editPrompt,
  setEditPrompt,
  isPenToolActive,
  isTextToolActive,
  setIsTextToolActive,
  dalleImages,
  selectedImageIndex,
  //   imageData,
  hoodieImage,
  canvasRef,
  points,
  setPoints,
  setMaskPoints,
  maskPoints,
  clearSelection,
  setClearSelection,
  isEraserActive,
  setIsLoading,
  eraserSize,
  isInverted,
  setIsInverted,
  maskCanvas,
  setMaskCanvas,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const imageLoadedRef = useRef(false);

  const [textPosition, setTextPosition] = useState(null);
  const [currentText, setCurrentText] = useState("");
  const [originalHoodieImage, setOriginalHoodieImage] = useState(hoodieImage);

  useEffect(() => {
    console.log(dalleImages[selectedImageIndex]);
  });

  // useEffect(() => setTimeout(() => setIsLoading(false), 1000));

  useEffect(() => {
    console.log("canvasRef.current:", canvasRef.current);
  }, [clearSelection]);

  useEffect(() => {
    console.log("points", points);
    console.log(hoodieImage);
  }, [points, hoodieImage]);

  useEffect(() => {
    console.log("points", points);
    console.log(lastPointRef);
    if (clearSelection) {
      console.log("selection cleared");
      lastPointRef.current = null; // Reset lastPointRef to null

      // Clear the points and redraw the original image
      setPoints([]);
      setMaskPoints([]);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      // console.log("testing");
      const img = new Image();
      img.src = originalHoodieImage;
      console.log("hoodie Image: ", hoodieImage);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Redraw the original image
      };
      setTimeout(setClearSelection(false), 2000); // Reset clearSelection to false after clearing
    }
  }, [clearSelection]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const uiCanvas = uiCanvasRef.current;
      uiCanvas.width = container.clientWidth;
      uiCanvas.height = container.clientHeight;

      // Redraw the image after resizing the canvas
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = hoodieImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    window.addEventListener("resize", handleResize);

    // Initial resize
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [hoodieImage]);

  useEffect(() => {
    console.log(hoodieImage);
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous"; // This will allow cross-origin image to be used.

    img.src = hoodieImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [hoodieImage]);

  let lastPointRef = useRef(null);
  let isFirstPoint = true; // Add a flag to track the first point

  const baseCanvasRef = useRef(); // For actual image manipulation
  const uiCanvasRef = useRef(); // For drawing points and lines

  // Modify the placePoint function to connect points with lines
  const placePoint = (event) => {
    const uiCanvas = uiCanvasRef.current; // Reference to the main canvas
    const ctx = uiCanvas.getContext("2d");

    const rect = uiCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isFirstPoint) {
      // Clear the points if it's the first point
      setPoints([]);
      isFirstPoint = false; // Reset the flag
    }

    // Visual feedback: Draw a small circle for the point
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 4 * Math.PI);
    ctx.fill();

    if (lastPointRef.current) {
      // Connect the current point to the last placed point with a line
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
    }

    // Update the lastPointRef with the current point
    lastPointRef.current = { x, y };

    // Add the current point to the points array
    setPoints([...points, { x, y }]);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTextToolActive && textPosition) {
        // Append the new character to currentText
        setCurrentText((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTextToolActive, textPosition]);

  useEffect(() => {
    if (textPosition) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = hoodieImage;

      img.onload = () => {
        // Redraw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add the text
        ctx.font = "16px Arial";
        ctx.fillText(currentText, textPosition.x, textPosition.y);

        // Update hoodieImage with the new canvas content
        const updatedImage = canvas.toDataURL();
        setTimeout(setHoodieImage(updatedImage), 500);
      };
    }
  }, [currentText, textPosition, hoodieImage]);

  // Constants
  const ERASER_SIZE = eraserSize; // Example eraser size
  const LINE_WIDTH = 1; // Example line width

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isEraserActive) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = ERASER_SIZE;
      ctx.lineCap = "round";
      setIsDrawing(true);

      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (isPenToolActive) {
      placePoint(event);
      setIsDrawing(true);
    } else if (isTextToolActive) {
      const { left, top } = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      setTextPosition({ x, y });
      setCurrentText("");
    }
  }

  function handleMouseMove(event) {
    if (isDrawing && isEraserActive) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  function handleMouseUp() {
    setIsDrawing(false);
    if (isEraserActive) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
    }
  }

  const downloadCanvasAsImage = (canvas, filename) => {
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const completeSelection = () => {
    if (!isPenToolActive) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = 1024;
    tempCanvas.height = 1024;

    // canvas.width = 1024;
    // canvas.height = 1024;

    // Draw the original canvas content onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    if (isInverted) {
      // Make the outer contents of the shape transparent
      tempCtx.globalCompositeOperation = "destination-in";
    } else {
      // Make the inside of the shape transparent
      tempCtx.globalCompositeOperation = "destination-out";
    }

    // Begin a new path for the shape on the temporary canvas
    tempCtx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        tempCtx.moveTo(point.x, point.y);
      } else {
        tempCtx.lineTo(point.x, point.y);
      }
    });
    tempCtx.closePath();
    tempCtx.fill();

    // Clear the original canvas and draw the modified content back onto it
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    if (!isInverted) {
      // Overlay a checkered pattern for visual representation
      const patternCanvas = document.createElement("canvas");
      const patternCtx = patternCanvas.getContext("2d");
      patternCanvas.width = 10;
      patternCanvas.height = 10;

      // Draw a checkered pattern
      patternCtx.fillStyle = "white";
      patternCtx.fillRect(0, 0, 5, 5);
      patternCtx.fillRect(5, 5, 5, 5);
      patternCtx.fillStyle = "gray";
      patternCtx.fillRect(0, 5, 5, 5);
      patternCtx.fillRect(5, 0, 5, 5);

      const pattern = ctx.createPattern(patternCanvas, "repeat");
      ctx.fillStyle = pattern;
      ctx.fill();
    }

    // Draw the stroke for the selection
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = LINE_WIDTH;
    ctx.stroke();

    // Convert the canvas content to a data URL and set the hoodie image
    const newHoodieImage = canvas.toDataURL();
    setHoodieImage(newHoodieImage);

    // Reset the drawing state and clear the points
    setIsDrawing(false);
    // setPoints([]);
  };

  // const completeSelection = () => {
  //   if (!isPenToolActive) return;
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   // Create a temporary canvas
  //   const tempCanvas = document.createElement("canvas");
  //   const tempCtx = tempCanvas.getContext("2d");
  //   tempCanvas.width = canvas.width;
  //   tempCanvas.height = canvas.height;

  //   // Draw the original canvas content onto the temporary canvas
  //   tempCtx.drawImage(canvas, 0, 0);

  //   // Set the drawing mode to keep the inside of the shape
  //   tempCtx.globalCompositeOperation = "destination-in";

  //   // Begin a new path for the shape on the temporary canvas
  //   tempCtx.beginPath();
  //   points.forEach((point, index) => {
  //     if (index === 0) {
  //       tempCtx.moveTo(point.x, point.y);
  //     } else {
  //       tempCtx.lineTo(point.x, point.y);
  //     }
  //   });
  //   tempCtx.closePath();

  //   // Fill the shape, which will clip the outside content
  //   tempCtx.fill();

  //   // Clear the original canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Draw the modified content back onto the original canvas
  //   ctx.drawImage(tempCanvas, 0, 0);

  //   // Reset the drawing state and clear the points
  //   setIsDrawing(false);
  //   setPoints([]);
  // };

  return (
    <div
      className="editor-container"
      style={{
        height: `${
          window.innerHeight < 656
            ? "75%"
            : window.innerHeight < 720
            ? "87%"
            : window.innerHeight >= 720 && window.innerHeight < 800
            ? "95%"
            : "100%"
        }`,
        width: `${
          window.innerHeight < 656
            ? "75%"
            : window.innerHeight < 720
            ? "87%"
            : window.innerHeight >= 720 && window.innerHeight < 800
            ? "95%"
            : "100%"
        }`,
      }}
    >
      {/* <div> */}
      <canvas
        ref={uiCanvasRef}
        className="ui-canvas"
        style={{
          position: "absolute",
          zIndex: 1000,
          backgroundColor: "transparent",
          pointerEvents: "none",
        }}
      />

      <canvas
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
        className="image-canvas"
        style={{
          // height: `${
          //   window.innerHeight < 656
          //     ? "75%"
          //     : window.innerHeight < 720
          //     ? "87%"
          //     : window.innerHeight >= 720 && window.innerHeight < 800
          //     ? "95%"
          //     : "100%"
          // }`,
          // width: `${
          //   window.innerHeight < 656
          //     ? "75%"
          //     : window.innerHeight < 720
          //     ? "87%"
          //     : window.innerHeight >= 720 && window.innerHeight < 800
          //     ? "95%"
          //     : "100%"
          // }`,
          // height: `${"100%"}`,
          // width: `${"100%"}`,
          cursor: isPenToolActive
            ? `url(${penCursor}), auto`
            : isEraserActive
            ? "crosshair"
            : "default",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={completeSelection} // Close the selection with a double-click
      />
      {/* <canvas
        ref={uiCanvasRef}
        className="overlay-canvas"
        style={{
          // position: "absolute",
          // zIndex: 1000,
          top: 0,
          bottom: 0,
          // height: "100%",
          backgroundColor: "red",
          left: "0rem",
          // width: "100%",
        }}
      /> */}
      {/* </div> */}
    </div>
  );
};

const ImageEditor = ({
  setEditPopup,
  maskImage,
  editPrompt,
  setMaskImage,
  setEditPrompt,
  hoodieImage,
  dalleImages,
  setDalleImages,
  setSelectedImageIndex,
  selectedImageIndex,
  setHoodieImage,
}) => {
  const [helpContainer, setHelpContainer] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);
  const [maskPoints, setMaskPoints] = useState([]);
  const [isPenToolActive, setIsPenToolActive] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const [isTextToolActive, setIsTextToolActive] = useState(false);
  const [editedImage, setEditedImage] = useState("");
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eraserSize, setEraserSize] = useState(30); // default size
  const [isInverted, setIsInverted] = useState(false);
  const [maskCanvas, setMaskCanvas] = useState(null);
  const [helpToggle, setHelpToggle] = useState(false);

  useEffect(() => {
    console.log("loading is ", isLoading);
  }, [isLoading]);
  const handleInputChange = (event) => {
    // Update the editPrompt state with the new value of the input
    setEditPrompt(event.target.value);
    console.log(editPrompt);
  };

  const handleClearSelection = () => {
    setClearSelection(true); // Set clearSelection to true when the button is clicked
  };

  useEffect(() => {
    async function sendImageToProxy() {
      try {
        if (editedImage) {
          console.log("sending edited Image to proxy");

          // Send the editedImage to your proxy server
          const response = await axios.get(
            "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/image-proxy",
            {
              params: {
                imageUrl: editedImage,
              },
            }
          );

          if (
            response.status === 200 &&
            response.data &&
            response.data.imageUrl
          ) {
            console.log("Image from proxy received", response.data.imageUrl);

            // Set the image from the proxy to the hoodieImage
            setHoodieImage(response.data.imageUrl);

            console.log("SET");
            setMaskPoints([]); // Clear previous mask points
            setPoints([]); // Clear previous points
            setIsLoading(false);
          } else {
            console.error("Failed to get image from proxy");
          }
        }
      } catch (error) {
        console.error("Error sending editedImage to proxy:", error);
      }
    }

    sendImageToProxy();
  }, [editedImage]);

  const processImage = (img, x, y, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth * 0.45;
    canvas.height = window.innerWidth * 0.45;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);

    setImageData(canvas.toDataURL());
  };

  const handleDownload = (filename, data) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = data;
    link.click();
  };

  const resizeCanvas = (originalCanvas, width, height) => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(originalCanvas, 0, 0, width, height);
    return tempCanvas;
  };

  const convertToPNG = async (dataURL) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = function (err) {
        reject(err);
      };
      img.src = dataURL;
    });
  };

  const downloadMask = () => {
    setIsLoading(true);

    if (canvasRef.current) {
      const originalCanvas = canvasRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = originalCanvas.width;
      tempCanvas.height = originalCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Step 1: Draw the original canvas onto the temporary canvas
      tempCtx.drawImage(
        originalCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      console.log("Step 1: Original canvas drawn onto temporary canvas");

      // Step 2: Create a copy of the canvas's image data
      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      console.log("Step 2: Image data copied");

      // Step 3: Iterate through the image data and make pixels with alpha value 0 transparent
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          imageData.data[i] = 255;
          imageData.data[i + 1] = 255;
          imageData.data[i + 2] = 255;
          imageData.data[i + 3] = 0;
        }
      }

      console.log("Step 3: Transparent pixels created");

      // Step 4: Put the modified image data back onto the temporary canvas
      tempCtx.putImageData(imageData, 0, 0);

      console.log("Step 4: Modified image data put back onto temporary canvas");

      // Step 5: Set the global composite operation to "destination-out"
      tempCtx.globalCompositeOperation = "destination-out";

      console.log(
        "Step 5: Global composite operation set to 'destination-out'"
      );

      // Step 6: Scale the mask points to match the canvas size
      const scaleX = tempCanvas.width / originalCanvas.width;
      const scaleY = tempCanvas.height / originalCanvas.height;

      console.log("Step 6: Mask points scaled");

      // Step 7: Draw the mask shape
      tempCtx.beginPath();
      maskPoints.forEach((point, index) => {
        const scaledX = point.x * scaleX;
        const scaledY = point.y * scaleY;
        if (index === 0) {
          tempCtx.moveTo(scaledX, scaledY);
        } else {
          tempCtx.lineTo(scaledX, scaledY);
        }
      });
      tempCtx.closePath();
      tempCtx.fill();

      console.log("Step 7: Mask shape drawn");

      // Step 8: Convert the temporary canvas to a data URL
      const maskData = tempCanvas.toDataURL("image/png");

      console.log("Step 8: Temporary canvas converted to data URL");

      // Step 9: Set the mask image data
      setMaskImage(maskData);

      console.log("Step 9: Mask image data set");
    }

    setIsLoading(false);
    setPoints([]);
  };

  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  function dataURLtoBlob(dataurl, label) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log("MIME type for", label, ":", mime);
    return new Blob([u8arr], { type: mime });
  }

  const generateEdit = useCallback(async () => {
    setIsLoading(true);
    console.log("testing to see if this calls every time");

    try {
      console.log("editPrompt value: ", editPrompt);
      console.log("image value: ", hoodieImage);
      console.log("mask value: ", maskImage);

      console.log("maskImage", maskImage);

      const formData = new FormData();

      if (hoodieImage) {
        console.log("hoodie image is logging");
        const pngHoodieImage = await convertToPNG(hoodieImage);
        const imageBlob = dataURLtoBlob(pngHoodieImage, "hoodieImage");
        formData.append("image", imageBlob, "image.png");
      }

      if (maskImage) {
        const maskBlob = dataURLtoBlob(maskImage, "maskImage");
        formData.append("mask", maskBlob, "mask.png");
        console.log("maskBlob:", maskBlob);
      }

      console.log("formData:", formData);

      formData.append("prompt", editPrompt || "test prompt");

      const response = await axios.post(
        "https://api.openai.com/v1/images/edits",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      console.log(response);
      console.log(response.data.data.map((img) => img.url));
      setEditedImage(response.data.data[0].url);
      console.log(editedImage);
    } catch (error) {
      console.error("Error generating edit: ", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    } finally {
      // setIsLoading(false);
    }
  }, [hoodieImage, maskImage, apiKey, editedImage]);

  useEffect(() => {
    if (maskImage) {
      generateEdit();
    }
  }, [maskImage]);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const [sliderValue, setSliderValue] = useState(30); // Initial slider value

  const handleSliderMouseUp = () => {
    setEraserSize(sliderValue);
    console.log("Final slider value:", sliderValue);
  };

  const sliderStyle = {
    background: `linear-gradient(to right, white 0%, white ${sliderValue}%, gray ${sliderValue}%, white 120%)`,
  };

  return (
    <motion.div
      key="image-editor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 2 }}
      className="image-editor-container"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // maxWidth: "700px",
        }}
      >
        <div className="image-editor-sub-container">
          <div className="image-editor-sub-container-content">
            <div className="formatting-bar">
              <img
                src={xIcon}
                alt="close"
                width={35}
                className="image-editor-x-btn"
                onClick={() => {
                  setEditPopup(false);
                  setIsLoading(false);
                }}
              />
              <div className="slider-container">
                {isEraserActive && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        border: "1px solid white",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={sliderValue}
                      onChange={handleSliderChange}
                      onMouseUp={handleSliderMouseUp}
                      className="slider"
                      style={sliderStyle}
                    />
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        border: "1px solid white",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => handleClearSelection()}
                    className="clear-selection-btn"
                  >
                    Undo
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // flexDirection: "column",
                //
              }}
              className="buttons-canvas-container"
            >
              <div
                className="image-editor-buttons-container"
                style={{ maxWidth: "100px" }}
              >
                {/* <button
                  onClick={() => {
                    setIsInverted(false);
                    setIsPenToolActive(true);
                    setIsEraserActive(false);
                    // setSliderValue(30);
                    setEraserSize(10);
                  }}
                >
                  <img
                    className="editor-icon"
                    src={penIcon}
                    alt="penIcon"
                  ></img>
                  Pen
                </button> */}
                {/* <button
                  onClick={() => {
                    setIsPenToolActive(false);
                    setIsEraserActive(true);
                    console.log("eraser active");
                  }}
                >
                  <img
                    className="editor-icon"
                    src={eraserIcon}
                    alt="eraserIcon"
                  ></img>
                  Eraser
                </button> */}
                <button
                  onClick={() => {
                    setIsInverted(true);
                    setIsPenToolActive(true);
                    setIsEraserActive(false);
                  }}
                >
                  <img
                    className="editor-icon"
                    src={scissorsIcon}
                    alt="eraserIcon"
                  ></img>
                  Cut
                </button>

                {/* <button onClick={() => setIsTextToolActive(true)}>
                  <img
                    className="editor-icon"
                    src={textIcon}
                    alt="penIcon"
                  ></img>
                  Text
                </button> */}
                <button onClick={() => setHelpToggle(!helpToggle)}>
                  <img
                    className="editor-icon"
                    src={noteIcon}
                    alt="noteIcon"
                  ></img>
                  Notes
                </button>
                <button onClick={() => setHelpToggle(!helpToggle)}>
                  <img
                    className="editor-icon"
                    src={helpIcon}
                    alt="helpIcon"
                  ></img>
                  Help
                </button>
              </div>

              {/* <img
              className="selected-editor-image"
              alt="selectedImage"
              src={dalleImages[selectedImageIndex]}
            ></img> */}
              <div className="canvas-container">
                {helpToggle ? (
                  <div className="help-content">
                    {/* You can add more detailed help information here */}
                    Help
                  </div>
                ) : isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                      alignItems: "center",
                      boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.3)",
                      borderRadius: "1rem",
                      borderBottomRightRadius: "0",
                    }}
                  >
                    <Ring
                      size={40}
                      lineWeight={5}
                      speed={2}
                      color="white"
                      style={{ marginTop: "2rem" }}
                    />
                  </div>
                ) : (
                  <ImageCanvas
                    setIsLoading={setIsLoading}
                    isEraserActive={isEraserActive}
                    setHoodieImage={setHoodieImage}
                    setClearSelection={setClearSelection}
                    isPenToolActive={isPenToolActive}
                    isTextToolActive={isTextToolActive}
                    setIsTextToolActive={setIsTextToolActive}
                    setMaskPoints={setMaskPoints}
                    maskPoints={maskPoints}
                    points={points} // Pass points as prop
                    setPoints={setPoints} // Pass setPoints as prop
                    hoodieImage={hoodieImage}
                    dalleImages={dalleImages}
                    selectedImageIndex={selectedImageIndex}
                    className={"image-canvas"}
                    imageData={imageData}
                    canvasRef={canvasRef}
                    clearSelection={clearSelection}
                    eraserSize={eraserSize}
                    setIsInverted={setIsInverted}
                    isInverted={isInverted}
                    maskCanvas={maskCanvas}
                    setMaskCanvas={setMaskCanvas}
                    setMaskImage={setMaskImage}
                  />
                )}
              </div>
            </div>
            {/* <div
              className="image-editor-input-container"
              style={{
                display: "flex",
                gap: 0,
                // justifyContent: "center",
                backgroundColor: "rgb(20,20,20)",
                borderBottomRightRadius: "1rem",
                borderBottomLeftRadius: "1rem",
                // paddingBottom: ".1rem",
                // justifyContent: "space-between",
                // width: "50%",
                // marginLeft: "20vw",
                // marginRight: "20vw",
              }}
            >
              <input
                onChange={handleInputChange}
                placeholder="Type anything you want to fill into your selection..."
                className="generate-input"
                style={{
                  width: "81%",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                  borderTopLeftRadius: "0",
                }}
              ></input>
              <button
                disabled={!editPrompt}
                onClick={downloadMask}
                className="generate-button"
              >
                <img
                  className="editor-icon"
                  src={genieIcon}
                  style={{ width: "30px" }}
                  alt="genieIcon"
                ></img>
                Generate
              </button>
            </div> */}

            {/* <div className="image-editor-help-container">
              <button onClick={() => setHelpContainer(!helpContainer)}>
                <img
                  className="editor-icon"
                  src={helpIcon}
                  alt="helpIcon"
                ></img>
                Help
              </button>
              {helpContainer && <div className="help-content-container"></div>}
            </div> */}
          </div>
          {/* <div className="image-editor-input-container">
            <input
              onChange={handleInputChange}
              placeholder="Type anything you want to fill into your selection..."
              className="generate-input"
            ></input>
            <button
              disabled={!editPrompt}
              onClick={downloadMask}
              className="generate-button"
            >
              <img
                className="editor-icon"
                src={genieIcon}
                style={{ width: "30px" }}
                alt="genieIcon"
              ></img>
              Generate
            </button>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageEditor;
