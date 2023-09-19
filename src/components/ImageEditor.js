import { useState, useEffect, useRef } from "react";

export default function ImageEditor({ selectedImage }) {
  const [imageData, setImageData] = useState(null);
  const canvasRef = useRef(null);

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       const img = new Image();
  //       img.src = reader.result;
  //       img.onload = () => {
  //         const dimension = Math.min(img.width, img.height);
  //         processImage(img, 0, 0, dimension, dimension);
  //       };
  //     };

  //     reader.readAsDataURL(file);
  //   };

  useEffect(() => {
    const processImage = (img, x, y, width, height) => {
      // console.log(width, height, img, x, y);
      const canvas = document.createElement("canvas");
      canvas.width = width; // Use image width
      canvas.height = height; // Use image height
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        x,
        y,
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      setImageData(selectedImage);
    };

    if (typeof selectedImage === "string") {
      // If selectedImage is a URL, load it as an image
      const img = new Image();
      img.src = selectedImage;
      img.onload = () => {
        const dimension = Math.min(img.width, img.height);
        processImage(img, 0, 0, dimension, dimension);
      };
    }
  }, [selectedImage]);

  return (
    <div>
      {/* <h2 style={styles.header}>Image Mask Editor</h2> */}
      {/* <img src={selectedImage} width={200} /> */}
      {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
      {imageData && <ImageCanvas imageData={imageData} canvasRef={canvasRef} />}
      {/* <DownloadButtons canvasRef={canvasRef} originalImage={imageData} /> */}
    </div>
  );
}

const ImageCanvas = ({ imageData, canvasRef }) => {
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width; // Set canvas width to match image width
      canvas.height = img.height; // Set canvas height to match image height
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setIsImageLoaded(true);
    };

    img.src = imageData; // Set the image source after defining the onload handler
  }, [imageData, canvasRef]);

  const drawPoints = () => {
    if (isImageLoaded) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Redraw all points
      ctx.fillStyle = "red";
      ctx.beginPath(); // Begin the path once for all points
      points.forEach((point) => {
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      });
      ctx.fill(); // Fill the entire path with the specified fill style
    }
    console.log(points);
  };

  const placePoint = (event) => {
    if (isImageLoaded && isDrawing) {
      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();
      console.log(event.clientX, canvasRect.left);
      console.log(canvasRect);
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;
      setPoints([...points, { x, y }]);
      drawPoints(); // Redraw the canvas with the new point
    }
  };

  const handleMouseDown = (event) => {
    placePoint(event);
    setIsDrawing(true);
  };

  const completeSelection = () => {
    if (isImageLoaded) {
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
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();

      // Reset the drawing state and clear the points
      setIsDrawing(false);
      setPoints([]);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      //   style={styles.canvas}
      onMouseDown={handleMouseDown}
      onDoubleClick={completeSelection} // Close the selection with a double-click
    />
  );
};

const DownloadButtons = ({ canvasRef, originalImage, selectedImage }) => {
  const handleDownload = (filename, data) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = data;
    link.click();
  };

  const downloadMask = () => {
    if (canvasRef.current) {
      const maskData = canvasRef.current.toDataURL();
      handleDownload("mask.png", maskData);
    }
  };

  return (
    <div style={styles.buttonGroup}>
      <button onClick={() => handleDownload("original.png", originalImage)}>
        Download Original
      </button>
      <button onClick={downloadMask}>Download Mask</button>
    </div>
  );
};

const styles = {
  appContainer: {
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    color: "white",
    // height: "100vh",
    // backgroundColor: "#f5f5f5",
    // zIndex: 1000,
  },
  header: {
    // marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  canvas: {
    // border: "2px solid #333",
    // margin: 20,
    // width: "40rem",
    // height: "40rem",
    // position: "fixed",
    zIndex: 1000,
  },
  buttonGroup: {
    display: "flex",
    gap: 10,
  },
};
