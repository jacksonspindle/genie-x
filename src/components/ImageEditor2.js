import React, { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import { motion } from "framer-motion"; // Import motion
import PenTool from "./PenTool";

const ImageEditor2 = () => {
  const canvasRef = useRef(null);
  const [toolbarVisible, setToolbarVisible] = useState(true); // State to manage toolbar visibility
  const [isPenToolActive, setIsPenToolActive] = useState(false); // New state for pen tool mode
  const isPenToolActiveRef = useRef(isPenToolActive); // Use a ref for the pen tool state
  const currentPathRef = useRef(null); // Use a ref for the current drawing path

  const canvasInstanceRef = useRef(null);

  // Initialize pointsRef and pathsRef
  const pointsRef = useRef([]);
  const pathsRef = useRef([]);

  useEffect(() => {
    isPenToolActiveRef.current = isPenToolActive; // Update ref when state changes
  }, [isPenToolActive]);

  const startDrawing = useCallback((opt) => {
    console.log("drawing");
    if (!isPenToolActiveRef.current) return;
    const pointer = canvasInstanceRef.current.getPointer(opt.e);

    // If there's an existing path, add new points to it
    if (pathsRef.current.length > 0) {
      const lastPath = pathsRef.current[pathsRef.current.length - 1];
      lastPath.path.push(["L", pointer.x, pointer.y]);
      lastPath.set({ dirty: true });
      lastPath.setCoords();
      canvasInstanceRef.current.renderAll();
    } else {
      // If there's no existing path, create a new one
      const newPath = new fabric.Path(`M ${pointer.x} ${pointer.y}`, {
        fill: "",
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      canvasInstanceRef.current.add(newPath);
      pathsRef.current.push(newPath);
    }
  }, []);

  const endDrawing = useCallback(() => {
    if (pointsRef.current.length < 2) return; // Must have at least two points to create a path
    const pathData = pointsRef.current
      .map((point) => `${point.left},${point.top}`)
      .join(" ");
    const path = new fabric.Path(`M ${pathData}`, {
      fill: "",
      stroke: "black",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    canvasInstanceRef.current.add(path);
    pathsRef.current.push(path);
    // Clear points for next selection
    clearPoints();
  }, []);

  const clearPoints = () => {
    pointsRef.current.forEach((point) =>
      canvasInstanceRef.current.remove(point)
    );
    pointsRef.current = [];
  };

  // Event listener for double click to end drawing

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "white",
      selection: true,
    });

    canvasInstanceRef.current = canvas;

    window.canvasInstance = canvas;

    canvasInstanceRef.current.on("mouse:dblclick", endDrawing);

    if (!canvas) return; // Ensure canvas exists before proceeding

    // Remove all existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    if (isPenToolActive) {
      canvas.on("mouse:down", startDrawing);
      //   canvas.on("mouse:move", continueDrawing);
      canvas.on("mouse:up", endDrawing);
    }

    const toolbar = document.getElementById("toolbar");
    const deleteButton = document.getElementById("deleteObject");

    const handleZoom = () => {
      setToolbarVisible(false); // Hide the toolbar on zoom
    };

    const positionToolbar = (activeObject) => {
      if (!activeObject) {
        setToolbarVisible(false); // Hide the toolbar if there's no selection
        return;
      }

      setToolbarVisible(true); // Ensure toolbar is visible upon selection

      const objectBoundingBox = activeObject.getBoundingRect();
      toolbar.style.width = `${objectBoundingBox.width - 18}px`;
      toolbar.style.top = `${
        objectBoundingBox.top - toolbar.offsetHeight + 80
      }px`;
      toolbar.style.left = `${objectBoundingBox.left}px`;
      toolbar.style.display = "block";
    };

    canvas.on("selection:created", function (event) {
      positionToolbar(event.target);
    });

    canvas.on("selection:updated", function (event) {
      positionToolbar(event.target);
    });

    canvas.on("object:moving", function (event) {
      positionToolbar(event.target);
    });

    canvas.on("selection:cleared", function () {
      setToolbarVisible(false);
    });

    // Ensure `positionToolbar` is called even when an object is initially selected without movement
    canvas.on("mouse:down", function (options) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // Object is selected, ensure toolbar visibility is updated
        positionToolbar(activeObject);
      }
    });

    deleteButton.onclick = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        setToolbarVisible(false); // Ensure the toolbar visibility is updated correctly here as well
      }
    };

    const handleMouseWheel = (opt) => {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      handleZoom();
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;

      if (files.length === 1 && files[0].type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          fabric.Image.fromURL(e.target.result, function (img) {
            img.set({
              left: 100,
              top: 100,
              scaleX: 0.5,
              scaleY: 0.5,
              selectable: true,
              hasControls: true,
              hasBorders: true,
              hasRotatingPoint: true,
            });
            canvas.add(img);
            canvas.setActiveObject(img); // Ensure the object is set as active

            canvas.renderAll();
            positionToolbar(img); // Call positionToolbar here with the newly loaded image
          });
        };

        reader.readAsDataURL(files[0]);
      }
    };

    // Attach mouse wheel listener for zooming
    canvas.on("mouse:wheel", handleMouseWheel);

    // Keyboard event for deleting selected objects
    const handleKeyDown = (e) => {
      console.log(e.key);
      // Check both the `key` and `keyCode` for broader compatibility
      if (e.key === "Backspace" || e.keyCode === 46) {
        console.log("delete");
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject(); // Deselect the object
          canvas.requestRenderAll(); // Re-render the canvas
        }
        e.preventDefault(); // Prevent any default browser behavior associated with the Delete key
      }
    };

    // Add event listeners for drag/drop and keyboard interactions
    document.addEventListener("dragover", handleDragOver, false);
    document.addEventListener("drop", handleDrop, false);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clean up event listeners
      document.removeEventListener("dragover", handleDragOver, false);
      document.removeEventListener("drop", handleDrop, false);
      document.removeEventListener("keydown", handleKeyDown);
      canvas.off("mouse:wheel", handleMouseWheel);
      canvas.dispose();
    };
  }, [isPenToolActive, startDrawing, endDrawing]);

  // Toggle the pen tool mode
  const togglePenTool = () => {
    setIsPenToolActive((prevIsPenToolActive) => {
      // If we're turning off the pen tool and there's a selected object, ensure it stays selected
      if (prevIsPenToolActive) {
        const activeObject = canvasInstanceRef.current?.getActiveObject();
        if (activeObject) {
          // Temporarily set the object as selectable and evented again
          activeObject.set({
            selectable: true,
            evented: true,
          });
          // Re-render the canvas to reflect this change
          canvasInstanceRef.current?.requestRenderAll();
        }
      }
      // Return the new state
      return !prevIsPenToolActive;
    });
  };

  const downloadScreenshot = () => {
    if (window.canvasInstance) {
      const dataURL = window.canvasInstance.toDataURL({
        format: "png",
        multiplier: 1,
      });

      const link = document.createElement("a");
      link.download = "canvas-screenshot.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} className="unique-canvas-class" />
      <button onClick={downloadScreenshot}>Download Screenshot</button>
      <motion.div
        id="toolbar"
        initial={{ opacity: 1 }}
        animate={{ opacity: toolbarVisible ? 1 : 0 }} // Animate opacity based on toolbarVisible state
        transition={{ duration: 0.1 }} // Adjust animation duration as needed
      >
        <button id="deleteObject">Delete</button>
        <button id="deleteObject">Crop</button>
        <button id="deleteObject">Cut</button>
        <button id="deleteObject">Delete</button>
        <PenTool canvas={window.canvasInstance} togglePenTool={togglePenTool} />
        {/* Add more buttons for other functionalities here */}
      </motion.div>
    </div>
  );
};

export default ImageEditor2;
