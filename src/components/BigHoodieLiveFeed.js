import React, { useEffect, useState, useRef, startTransition } from "react";
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
import { MotionCanvas, LayoutCamera } from "framer-motion-3d";

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

const BigHoodieLiveFeed = () => {
  const [textures, setTextures] = useState(null);
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

      startTransition(() => {
        setTextures({ colorMap, normalMap, roughnessMap, aoMap });
      });
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

  if (!textures) {
    return <div>Loading...</div>; // Show a loading indicator while textures are loading
  }

  const { colorMap, normalMap, roughnessMap, aoMap } = textures;

  return (
    <div style={{ height: "100vh", backgroundColor: "white", padding: 0 }}>
      <Clock />
      <Canvas
        ref={canvasRef}
        className="live-hoodie-feed-canvas"
        camera={{
          fov: 51, // Optional: Field of view
        }}
      >
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 15, 45]} angle={0.3} intensity={0.4} />
        <spotLight position={[-10, 15, 45]} angle={0.3} intensity={0.4} />
        <CameraController />
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
            map={colorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            aoMap={aoMap}
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
