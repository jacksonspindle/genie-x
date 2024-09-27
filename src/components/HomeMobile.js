import { Canvas } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import hoodieFront from "../assets/hoodieFront.png";
import { HoodieHomePage } from "./HoodieHomePage";
import homePageSampleImage1 from "../assets/homePageSampleImage1.jpeg";
import homePageSampleImage2 from "../assets/homePageSampleImage2.jpeg";
import homePageSampleImage3 from "../assets/homePageSampleImage3.PNG";
import homePageSampleImage4 from "../assets/homePageSampleImage4.jpg";
import { motion, useInView, AnimatePresence } from "framer-motion";

const HomeMobile = () => {
  // Create an array of image objects with src and name
  const images = [
    {
      src: homePageSampleImage1,
      name: "Oil painting card game between a sailor, merchant, pharaoh",
    },
    {
      src: homePageSampleImage2,
      name: "Bee landing on a chrome flower growing from lava",
    },
    {
      src: homePageSampleImage3,
      name: "Van Gogh style painting of flower in a pond",
    },
    {
      src: homePageSampleImage4,
      name: "Comic book style drawing of golfer at sunset",
    },
  ];

  // State to track the selected image object
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Function to handle image click and load texture
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Refs and inView hooks for each section
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);

  const creativityRef = useRef(null);
  const isCreativityInView = useInView(creativityRef);

  const canvasRef = useRef(null);
  const isCanvasInView = useInView(canvasRef);

  // Animation variants using transform properties
  const fadeInUp = {
    visible: { opacity: 1, transform: "translateY(0)" },
    hidden: { opacity: 0, transform: "translateY(20px)" },
  };

  const fadeIn = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const scaleIn = {
    visible: { opacity: 1, transform: "scale(1)" },
    hidden: { opacity: 0, transform: "scale(0.8)" },
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(136,107,255,1) 0%, rgba(80,177,254,1) 49%, rgba(255,255,255,1) 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        variants={fadeIn}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        transition={{ duration: 1 }}
      >
        <motion.h2
          style={{
            top: "12%",
            position: "absolute",
            fontFamily: "oatmeal-pro-bold",
            fontSize: "33px",
          }}
          className="shadow"
          variants={fadeInUp}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Act of Creation
        </motion.h2>

        <motion.img
          src={hoodieFront}
          alt="Hoodie Front"
          style={{ width: "250px", position: "absolute" }}
          variants={scaleIn}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.4 }}
        />

        <motion.button
          className="hero-button"
          variants={fadeInUp}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Design Now
        </motion.button>
      </motion.section>

      {/* Creativity Section */}
      <motion.section
        ref={creativityRef}
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "white",
          position: "relative",
          overflow: "hidden",
        }}
        variants={fadeIn}
        initial="hidden"
        animate={isCreativityInView ? "visible" : "hidden"}
        transition={{ duration: 1 }}
      >
        <motion.h2
          style={{
            fontFamily: "oatmeal-pro-bold",
            fontSize: "50px",
            marginLeft: "1rem",
            marginBottom: "0",
            padding: ".5rem",
            marginTop: "0",
          }}
          variants={fadeInUp}
          initial="hidden"
          animate={isCreativityInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Creativity
        </motion.h2>
        <motion.p
          style={{
            fontFamily: "oatmeal-pro-regular",
            marginLeft: "1rem",
            fontSize: "25px",
            marginTop: "1rem",
            opacity: ".5",
            padding: ".5rem",
            marginBottom: "0",
            color: "gray",
          }}
          variants={fadeInUp}
          initial="hidden"
          animate={isCreativityInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Design anything you want using just text.
        </motion.p>

        {/* Canvas Container */}
        <div
          style={{
            position: "relative",
            height: "480px",
            overflow: "hidden",
          }}
        >
          <motion.div
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            variants={fadeIn}
            initial="hidden"
            animate={isCanvasInView ? "visible" : "hidden"}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Canvas style={{ height: "100%", width: "100%" }}>
              <HoodieHomePage selectedImage={selectedImage.src} />
              {/* <OrbitControls enableZoom={false} /> */}
              <ambientLight intensity={0.3} />
              <Environment preset="city" />
            </Canvas>
          </motion.div>
        </div>

        {/* Thumbnails Section */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          variants={fadeInUp}
          initial="hidden"
          animate={isCanvasInView ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.div
            style={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(19,19,19,.6)",
              padding: "1rem",
              borderRadius: "1rem",
            }}
            variants={fadeInUp}
            initial="hidden"
            animate={isCanvasInView ? "visible" : "hidden"}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Use AnimatePresence to wrap the text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedImage.name}
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "oatmeal-pro-bold",
                  fontSize: "16px",
                  marginBottom: "10px",
                  marginTop: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {selectedImage.name}
              </motion.p>
            </AnimatePresence>
            {/* Image Thumbnails */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {images.map((image, index) => (
                <motion.img
                  key={index}
                  src={image.src}
                  alt={image.name}
                  onClick={() => handleImageClick(image)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: ".5rem",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    border:
                      selectedImage.src === image.src
                        ? "2px solid white"
                        : "2px solid transparent",
                  }}
                  variants={scaleIn}
                  initial="hidden"
                  animate={isCanvasInView ? "visible" : "hidden"}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomeMobile;
