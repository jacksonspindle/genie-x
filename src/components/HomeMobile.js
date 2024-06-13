import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import { Canvas } from "@react-three/fiber";
import { ActTShirtOversized } from "./ActTShirtOversized";
import { Environment, OrbitControls } from "@react-three/drei";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import splineGif from "../assets/orb2.gif";

const testimonials = [
  {
    image: "testimonial-image1.jpg",
    text: "This product changed my life! - Customer A",
  },
  {
    image: "testimonial-image2.jpg",
    text: "I can't imagine working without it. - Customer B",
  },
  {
    image: "testimonial-image3.jpg",
    text: "A game changer for my business. - Customer C",
  },
];

const HomeMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <ActTShirtOversized />
        <Environment preset="warehouse" />
        {/* <OrbitControls /> */}
      </Canvas>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            zIndex: "1000",
            color: "black",
            bottom: "10.5rem",
            fontSize: "50px",
            fontFamily: "act-of-creation",
            width: "80%",
            textAlign: "center",
          }}
        >
          MAXIMIZE YOUR CREATIVITY
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // padding: "1rem ",
            paddingTop: "0",
            backgroundColor: "white",
            width: "100%",
            position: "absolute",
            bottom: ".3rem",
          }}
        >
          <Link
            style={{
              position: "absolute",
              zIndex: "1000",
              backgroundColor: "black",
              bottom: "7rem",
              width: "120px",
              fontSize: "20px",
              fontFamily: "oatmeal-pro-bold",
              width: "35%",
            }}
            to="/design"
          >
            Design Now
          </Link>
        </div>
      </div>
      <div
        style={{
          pointerEvents: "none",
          width: "100vw",
          // backgroundColor: "white",
        }}
      >
        <Spline
          // style={{ width: "100vw", height: "520px" }}
          scene="https://prod.spline.design/ywTq9T9cBN2vgMou/scene.splinecode"
        />
      </div>
      <div
        style={{
          height: "1000px",
          position: "absolute",
          width: "100%",
          fontFamily: "act-of-creation",
          color: "black",
        }}
      >
        <h1
          style={{
            filter: "invert(1)",
            fontSize: "50px",
            // margin: -20,
          }}
        >
          DESIGN WITH AI
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "5rem",
            paddingLeft: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              width: "100%",
              fontFamily: "oatmeal-pro-bold",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "black",
                borderRadius: "10px",
                marginRight: "1rem",
              }}
            ></div>
            <p style={{ fontSize: "20px", maxWidth: "250px" }}>
              Design Products Using Text
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              width: "100%",
              fontFamily: "oatmeal-pro-bold",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "black",
                borderRadius: "10px",
                marginRight: "1rem",
              }}
            ></div>
            <p style={{ fontSize: "20px" }}>Edit Images With Ease</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              fontFamily: "oatmeal-pro-bold",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "black",
                borderRadius: "10px",
                marginRight: "1rem",
              }}
            ></div>
            <p style={{ fontSize: "20px" }}>Save Designs</p>
          </div>
        </div>

        <h1
          style={{
            filter: "invert(1)",
            fontSize: "50px",
            marginTop: 150,
          }}
        >
          PRODUCT SHOTS
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            marginTop: "2rem",
            padding: "0 2rem",
            height: "1200px",
          }}
        >
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
          <div style={{ backgroundColor: "gray", height: "300px" }}></div>
          <div style={{ backgroundColor: "gray", height: "300px" }}></div>
          <div
            style={{
              backgroundColor: "gray",
              height: "400px",
              gridColumn: "span 2",
            }}
          ></div>
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
          <div style={{ backgroundColor: "gray", height: "200px" }}></div>
        </div>

        <h1
          style={{
            filter: "invert(1)",
            fontSize: "50px",
            marginTop: 150,
          }}
        >
          TESTIMONIALS
        </h1>
        <div style={{ width: "80%", margin: "0 auto", paddingTop: "2rem" }}>
          <div style={{ position: "relative" }}>
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "2rem",
                zIndex: 2,
              }}
              onClick={prevTestimonial}
            >
              &lt;
            </button>
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={testimonials[currentIndex].image}
                  alt={`Testimonial ${currentIndex + 1}`}
                  style={{ height: "100%", width: "auto" }}
                />
                <p
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    color: "#000",
                  }}
                >
                  {testimonials[currentIndex].text}
                </p>
              </motion.div>
            </AnimatePresence>
            <button
              style={{
                position: "absolute",
                top: "50%",
                right: "0",
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "2rem",
                zIndex: 2,
              }}
              onClick={nextTestimonial}
            >
              &gt;
            </button>
          </div>
        </div>

        <div
          style={{
            height: "100px",
            backgroundColor: "black",
            marginTop: "5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
              gap: "1rem",
              marginLeft: "1rem",
              // fontSize: "12px",

              // padding: "2rem",
            }}
          >
            <h1>HOME</h1>
            <h1>DESIGN</h1>
            <h1>SHIPPING</h1>
            <h1>CONTACT</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;
