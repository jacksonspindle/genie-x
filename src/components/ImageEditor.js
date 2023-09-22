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
import genieIcon from "../assets/genieIcon.png";
import penCursor from "../assets/penCursor.png";
import { Configuration, OpenAIApi } from "openai";

const ImageCanvas = ({
  setHoodieImage,
  maskImage,
  setMaskImage,
  editPrompt,
  setEditPrompt,
  isPenToolActive,
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
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    console.log(dalleImages[selectedImageIndex]);
  });

  useEffect(() => {
    if (clearSelection) {
      // Clear the points and redraw the original image
      setPoints([]);
      setMaskPoints([]);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      const img = new Image();
      img.src = hoodieImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Redraw the original image
      };
      setClearSelection(false); // Reset clearSelection to false after clearing
    }
  }, [clearSelection]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

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

  const placePoint = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPoints([...points, { x, y }]);

    // Visual feedback: Draw a small circle for the point
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();

    console.log("point placed");
  };

  const handleMouseDown = (event) => {
    if (!isPenToolActive) return; // Do not place point if Pen tool is not active

    placePoint(event);
    setIsDrawing(true);
  };

  const completeSelection = () => {
    if (!isPenToolActive) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Create a pattern
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    patternCanvas.width = 10; // Width of one square of the pattern
    patternCanvas.height = 10; // Height of one square of the pattern

    // Draw a checkered pattern
    patternCtx.fillStyle = "white";
    patternCtx.fillRect(0, 0, 5, 5);
    patternCtx.fillRect(5, 5, 5, 5);
    patternCtx.fillStyle = "gray";
    patternCtx.fillRect(0, 5, 5, 5);
    patternCtx.fillRect(5, 0, 5, 5);

    // Use the pattern as fillStyle
    const pattern = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillStyle = pattern;
    ctx.fill();

    // Set maskPoints with the current points
    setMaskPoints(points);

    // Reset the drawing state and clear the points
    setIsDrawing(false);
    setPoints([]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="image-canvas"
      style={{
        cursor: isPenToolActive ? `url(${penCursor}), auto` : "default",
      }}
      //   style={styles.canvas}
      onMouseDown={handleMouseDown}
      onDoubleClick={completeSelection} // Close the selection with a double-click
    />
  );
};

const ImageEditor = ({
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
  const [editedImage, setEditedImage] = useState("");

  const handleInputChange = (event) => {
    // Update the editPrompt state with the new value of the input
    setEditPrompt(event.target.value);
    console.log(editPrompt);
  };

  const handleClearSelection = () => {
    setClearSelection(true); // Set clearSelection to true when the button is clicked
  };

  useEffect(() => {
    if (editedImage) {
      setHoodieImage(editedImage); // Update the hoodieImage with the editedImage
      setMaskPoints([]); // Clear previous mask points
      setPoints([]); // Clear previous points
    }
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

  const downloadMask = () => {
    console.log("downloadMask function entered");
    console.log("downloading image");
    if (canvasRef.current) {
      const originalCanvas = canvasRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 1024; // Set width to 1024
      tempCanvas.height = 1024; // Set height to 1024
      const tempCtx = tempCanvas.getContext("2d");

      // Calculate the scale factors
      const scaleX = tempCanvas.width / originalCanvas.width;
      const scaleY = tempCanvas.height / originalCanvas.height;

      // Draw the original image on the temporary canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = hoodieImage;
      img.onload = () => {
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        // Convert RGB to RGBA
        const imageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] === 0) {
            imageData.data[i] = 255; // Set Red to 255
            imageData.data[i + 1] = 255; // Set Green to 255
            imageData.data[i + 2] = 255; // Set Blue to 255
            imageData.data[i + 3] = 0; // Keep Alpha at 0
          }
        }
        tempCtx.putImageData(imageData, 0, 0);

        // Apply the mask (if any) on the temporary canvas
        tempCtx.globalCompositeOperation = "destination-out";

        // Draw the selection mask using scaled maskPoints
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
        tempCtx.fill(); // cut out the selection

        // Convert the temporary canvas to Data URL and download it
        const maskData = tempCanvas.toDataURL("image/png");
        handleDownload("mask.png", maskData);
        setMaskImage(maskData);
        console.log(maskData);
        generateEdit();
      };
    }
  };

  const apiKey = process.env.REACT_APP_OPENAI_KEY;

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const generateEdit = useCallback(async () => {
    try {
      console.log("editPrompt value: ", editPrompt);
      console.log("image value: ", hoodieImage);
      console.log("mask value: ", maskImage);

      const formData = new FormData();

      if (hoodieImage) {
        const imageBlob = dataURLtoBlob(hoodieImage);
        formData.append("image", imageBlob, "image.png");
      }

      if (maskImage) {
        const maskBlob = dataURLtoBlob(maskImage);
        formData.append("mask", maskBlob, "mask.png");
      }

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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  }, [editPrompt, hoodieImage, maskImage, apiKey]);

  return (
    <div className="image-editor-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="image-editor-sub-container">
          <div className="image-editor-sub-container-content">
            <div className="image-editor-buttons-container">
              <button onClick={() => setIsPenToolActive(!isPenToolActive)}>
                <img className="editor-icon" src={penIcon} alt="penIcon"></img>
                Pen
              </button>
              <button>
                <img
                  className="editor-icon"
                  src={eraserIcon}
                  alt="penIcon"
                ></img>
                Eraser
              </button>
              <button onClick={handleClearSelection}>
                {/* <img
                  className="editor-icon"
                  src={eraserIcon}
                  alt="penIcon"
                ></img> */}
                Clear Selection
              </button>
            </div>
            {/* <img
              className="selected-editor-image"
              alt="selectedImage"
              src={dalleImages[selectedImageIndex]}
            ></img> */}
            <div className="canvas-container">
              <ImageCanvas
                setHoodieImage={setHoodieImage}
                setClearSelection={setClearSelection}
                isPenToolActive={isPenToolActive}
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
              />
            </div>
            <div className="image-editor-help-container">
              <button onClick={() => setHelpContainer(!helpContainer)}>
                <img className="editor-icon" src={penIcon} alt="helpIcon"></img>
                Help
              </button>
              {helpContainer && <div className="help-content-container"></div>}
            </div>
          </div>

          <div className="image-editor-input-container">
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
              <img className="editor-icon" src={penIcon} alt="genieIcon"></img>
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
