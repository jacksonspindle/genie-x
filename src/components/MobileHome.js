import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

export function MobileHome({ scrollPosition }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/mobileHome.gltf");
  const { actions } = useAnimations(animations, group);

  const {
    thickness,
    roughness,
    clearcoat,
    clearcoatRoughness,
    transmission,
    ior,
    envMapIntensity,
    color,
    attenuationDistance,
    chromaticAberration,
  } = useControls({
    thickness: { value: 5, min: 0, max: 20 },
    roughness: { value: 0, min: 0, max: 5, step: 0.1 },
    clearcoat: { value: 1, min: 0, max: 5, step: 0.1 },
    clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0.9, max: 1, step: 0.01 },
    ior: { value: 1.25, min: 1, max: 2.3, step: 0.05 },
    envMapIntensity: { value: 25, min: 0, max: 100, step: 1 },
    color: "#ffffff",
    attenuationDistance: { value: 0, min: 0, max: 1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
  });

  useEffect(() => {
    if (actions.TshirtAction) {
      actions.TshirtAction.clampWhenFinished = true;
      actions.TshirtAction.play();
    }
    if (actions.Rectangle1) {
      actions.Rectangle1.clampWhenFinished = true;
      actions.Rectangle1.play();
    }
    if (actions.RectangleInput) {
      actions.RectangleInput.clampWhenFinished = true;
      actions.RectangleInput.play();
    }
    if (actions.TextAction) {
      actions.TextAction.clampWhenFinished = true;
      actions.TextAction.play();
    }
  }, [actions]);

  useFrame(() => {
    if (actions.TshirtAction) {
      actions.TshirtAction.time = scrollPosition / 100;
      actions.TshirtAction.paused = true; // This prevents the animation from playing on its own
    }
    if (actions.Rectangle1) {
      actions.Rectangle1.time = scrollPosition / 100;
      actions.Rectangle1.paused = true; // This prevents the animation from playing on its own
    }
    if (actions.RectangleInput) {
      actions.RectangleInput.time = scrollPosition / 100;
      actions.RectangleInput.paused = true; // This prevents the animation from playing on its own
    }
    if (actions.TextAction) {
      actions.TextAction.time = scrollPosition / 100;
      actions.TextAction.paused = true; // This prevents the animation from playing on its own
    }
  });

  const blackMaterial = new THREE.MeshStandardMaterial({ color: "#000000" });

  return (
    <group ref={group} dispose={null} position={[0, 0, 0]}>
      <group name="Scene">
        <group name="Node_0" scale={0.0015} position={[0.1, 1, 0]}>
          <group name="Scene_1">
            <group name="Default_Ambient_Light" position={[0, 1, 0]} />
            <group
              name="male_tshirt"
              position={[-72.53, 26.106, 174.257]}
              scale={0.678}
            >
              <mesh
                name="Tshirt"
                geometry={nodes.Tshirt.geometry}
                material={nodes.Tshirt.material}
                position={[-11.52, -21.55, 145.038]}
                scale={[3.566, 3.566, 1.606]}
              />
            </group>
            <mesh
              name="Rectangle_12"
              geometry={nodes.Rectangle_12.geometry}
              position={[-48, -2253.268, 32]}
            >
              <meshPhysicalMaterial
                thickness={thickness}
                roughness={roughness}
                clearcoat={clearcoat}
                clearcoatRoughness={clearcoatRoughness}
                transmission={transmission}
                ior={ior}
                envMapIntensity={envMapIntensity}
                color={color}
                attenuationDistance={attenuationDistance}
              />
            </mesh>
            <mesh
              name="Rectangle_9"
              geometry={nodes.Rectangle_9.geometry}
              position={[-50.153, -1581.817, 21]}
            >
              <meshPhysicalMaterial
                thickness={thickness}
                roughness={roughness}
                clearcoat={clearcoat}
                clearcoatRoughness={clearcoatRoughness}
                transmission={transmission}
                ior={ior}
                envMapIntensity={envMapIntensity}
                color={color}
                chromaticAberration={chromaticAberration}
                // attenuationDistance={attenuationDistance}
              />
            </mesh>
            <mesh
              name="Text"
              geometry={nodes.Text.geometry}
              material={nodes.Text.material}
              position={[2060.409, 1521.104, 10.614]}
              rotation={[-2.311, -0.325, -0.712]}
              scale={[1, 1, 10.593]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/mobileHome.gltf");

// Main component to include the MobileHome and scroll functionality
const HomeMobile = () => {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPos = scrollContainerRef.current.scrollTop;
        setScrollPosition(scrollPos);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Call handleScroll once to set the initial state based on the current scroll position
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef]);

  return (
    <div>
      <div style={{ height: "100vh" }}>
        <div
          ref={scrollContainerRef}
          style={{
            height: "130vh",
            overflowY: "scroll",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ height: "100vh", pointerEvents: "none", zIndex: 300 }}>
            <Canvas>
              <MobileHome scrollPosition={scrollPosition} />
            </Canvas>
          </div>
          <div style={{ height: "1000vh" }}></div>{" "}
          {/* Extra content for scrolling */}
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;
