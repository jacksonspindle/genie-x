import React, { useEffect, useState, useRef } from "react";
import { Vector3 } from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import {
  TextureLoader,
  RepeatWrapping,
  LinearFilter,
  sRGBEncoding,
} from "three";
import { OrbitControls, Plane, Box } from "@react-three/drei";
import { NewHoodie } from "./NewGenieXHoodie";
import woodFloorColor from "../assets/big_hoodie_live_feed_assets/wood_tiles/WoodFloor_Color.jpg";
import woodFloorNormal from "../assets/big_hoodie_live_feed_assets/wood_tiles/WoodFloor_Normal.jpg";
import woodFloorRoughness from "../assets/big_hoodie_live_feed_assets/wood_tiles/WoodFloor_Roughness.jpg";
import WoodFloorAmbientOcclusion from "../assets/big_hoodie_live_feed_assets/wood_tiles/WoodFloor_AmbientOcclusion.jpg";
import recordingIcon from "../assets/big_hoodie_live_feed_assets/recording.gif";
import { Couch } from "./big_hoodie_live_feed_components/Couch";
import { Table } from "./big_hoodie_live_feed_components/Table";
import { Rug } from "./big_hoodie_live_feed_components/Rug";
import { Lights } from "./big_hoodie_live_feed_components/Lights";
import { Piano } from "./big_hoodie_live_feed_components/Piano";
import { PuzzleHoodie } from "./big_hoodie_live_feed_components/PuzzleHoodie";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { Ring } from "@uiball/loaders";

const CameraController = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 8, 10); // Initial position
    camera.lookAt(new Vector3(0, 2.5, 0)); // Look at the origin
    camera.translateZ(-4); // Move the camera forward by 5 units
  }, [camera]);

  return null;
};

const Clock = () => {
  const [time, setTime] = useState(new Date()); // Current time state

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // Update time every second
    }, 1000);

    return () => {
      clearInterval(timer); // Clear interval on component unmount
    };
  }, []);

  return (
    <div className="clock" style={{ textAlign: "center", margin: "10px 0" }}>
      {time.toLocaleTimeString()} {/* Display time in human-readable format */}
      <img src={recordingIcon} width={20} alt="Recording icon" />
    </div>
  );
};

const LoadingOverlay = () => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "24px",
        zIndex: 1000,
        fontFamily: "oatmeal-pro-bold",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      Loading 3D elements...
      <Ring size={40} lineWeight={5} speed={2} color="white" />
    </motion.div>
  </AnimatePresence>
);

const BigHoodieLiveFeed = () => {
  const [textures, setTextures] = useState(null);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false); // Track if the full scene is loaded
  const canvasRef = useRef();

  // Load textures using useLoader hook inside the component
  const textureLoaderResults = useLoader(TextureLoader, [
    woodFloorColor,
    woodFloorNormal,
    woodFloorRoughness,
    WoodFloorAmbientOcclusion,
  ]);

  useEffect(() => {
    if (textureLoaderResults) {
      const [colorMap, normalMap, roughnessMap, aoMap] = textureLoaderResults;
      const repeatFactor = 4; // Adjust the repeat factor to make the texture appear smaller
      [colorMap, normalMap, roughnessMap, aoMap].forEach((map) => {
        map.wrapS = map.wrapT = RepeatWrapping;
        map.repeat.set(repeatFactor, repeatFactor);
        map.minFilter = LinearFilter;
        map.magFilter = LinearFilter;
        map.encoding = sRGBEncoding;
      });

      setTextures({ colorMap, normalMap, roughnessMap, aoMap });
    }
  }, [textureLoaderResults]);

  const handleContextLost = (event) => {
    event.preventDefault();
    console.warn("WebGL context lost.");
    // Handle context loss
  };

  const handleContextRestored = () => {
    console.warn("WebGL context restored.");
    // Reinitialize or restore the renderer state
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
      canvas.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );

      return () => {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      };
    }
  }, [canvasRef]);

  // Mark the scene as loaded once all assets have been added to the scene
  useEffect(() => {
    if (textures) {
      const timeout = setTimeout(() => setIsSceneLoaded(true), 1000); // Simulate loading time
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [textures]);

  return (
    <div
      style={{ height: "100vh", backgroundColor: "transparent", padding: 0 }}
    >
      {!isSceneLoaded && <LoadingOverlay />}
      {isSceneLoaded ? <Clock /> : null}
      <Canvas
        ref={canvasRef}
        className="live-hoodie-feed-canvas"
        camera={{
          fov: 51, // Optional: Field of view
        }}
        onCreated={() => setIsSceneLoaded(true)} // Set scene as loaded when Canvas is created
      >
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 15, 45]} angle={0.3} intensity={0.4} />
        <spotLight position={[-10, 15, 45]} angle={0.3} intensity={0.4} />
        <CameraController />
        {textures && (
          <>
            <PuzzleHoodie scale={[13, 13, 13]} position={[0, -10, 0]} />
            <Couch scale={[1.5, 1.5, 1.5]} position={[1, -0.8, 3.5]} />
            <Table scale={[1.5, 1.5, 1.5]} position={[1, -0.8, 3]} />
            <Rug scale={[1.5, 1.5, 1.5]} position={[0.8, -0.8, 3.2]} />
            <Lights scale={[1.5, 1.5, 1.5]} position={[0, -1.33, 2]} />
            <Piano scale={[1.5, 1.5, 1.5]} position={[0, -0.8, 2.5]} />
            <Plane
              args={[15, 10]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial
                map={textures.colorMap}
                normalMap={textures.normalMap}
                roughnessMap={textures.roughnessMap}
                aoMap={textures.aoMap}
              />
            </Plane>
            <Box args={[15, 10, 0.1]} position={[0, 1.5, -5]}>
              <meshStandardMaterial color="#001BFF" />
            </Box>
            <Box args={[0.1, 10, 10]} position={[-7.45, 1.5, 0]}>
              <meshStandardMaterial color="#001BFF" />
            </Box>
            <Box args={[0.1, 10, 10]} position={[7.45, 1.5, 0]}>
              <meshStandardMaterial color="#001BFF" />
            </Box>
          </>
        )}
        <OrbitControls
          enablePan={true}
          target={[0, 0.8, 0]}
          zoomSpeed={0.5}
          maxDistance={13}
          minDistance={4}
        />
      </Canvas>
    </div>
  );
};

export default BigHoodieLiveFeed;
