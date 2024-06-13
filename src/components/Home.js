import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";
import HomeNav from "./HomeNav";
import demoImage1 from "../assets/demoImage1.jpg";
import demoImage2 from "../assets/demoImage2.webp";
import demoImage3 from "../assets/demoImage3.png";
import demoImage4 from "../assets/demoImage4.png";
import { Canvas } from "@react-three/fiber";
import { ActShirt } from "./ActShirt";
import { Environment, OrbitControls } from "@react-three/drei";
import { AmbientLight } from "three";
import HomeMobile from "./HomeMobile";
import HomeNavMobile from "./HomeNavMobile";

// Helper function to split text into words
const splitTextIntoWords = (text, scrollingUp) => {
  return text.split(" ").map((word, index) => (
    <motion.span
      key={index}
      style={{ display: "inline-block", marginRight: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: scrollingUp ? 0 : 1, y: scrollingUp ? 20 : 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
    >
      {word}
    </motion.span>
  ));
};

const ProductShotSection = ({ scrollContainerRef, scrollingUp }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const totalHeight =
          scrollContainerRef.current.scrollHeight - containerHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;

        const showPercentage = 80; // Adjust these values based on your needs
        const hidePercentage = 101; // Adjust these values based on your needs

        if (
          scrollPercentage > showPercentage &&
          scrollPercentage < hidePercentage
        ) {
          setShowText(true);
        } else {
          setShowText(false);
        }
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

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: "1000",
        display: scrollingUp ? "none" : "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: "15vh", // Adjust position as needed
      }}
    >
      <AnimatePresence>
        {showText && (
          <motion.div
            className="product-shot-text"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px", // Optional: Add some space between images
              width: "70%", // Ensure the container takes the full width
              pointerEvents: "none", // Disable pointer events to ensure scrolling works
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
          >
            <img
              src={demoImage1}
              style={{ width: "35.3%", height: "auto", pointerEvents: "none" }}
            />
            <img
              src={demoImage2}
              style={{ width: "35.3%", height: "auto", pointerEvents: "none" }}
            />
            <img
              src={demoImage3}
              style={{ width: "35.3%", height: "auto", pointerEvents: "none" }}
            />
            <img
              src={demoImage4}
              style={{ width: "35.3%", height: "auto", pointerEvents: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroSection = ({ scrollContainerRef, scrollingUp }) => {
  const [showText, setShowText] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setInitialLoad(true);

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const totalHeight =
          scrollContainerRef.current.scrollHeight - containerHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;

        const showPercentage = -1; // Adjust these values based on your needs
        const hidePercentage = 0.4; // Adjust these values based on your needs

        if (
          scrollPercentage > showPercentage &&
          scrollPercentage < hidePercentage
        ) {
          setShowText(true);
        } else {
          setShowText(false);
        }
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
    <div
      style={{
        position: "absolute",
        zIndex: "1000",
        display: scrollingUp ? "none" : "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: "70vh",
      }}
    >
      <AnimatePresence>
        {initialLoad && showText && (
          <motion.h1
            className="hero-text"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
              exit: { opacity: 0, y: 20 },
            }}
            style={{
              color: "black",
              filter: "invert(1)",
              fontSize: window.innerWidth > 800 ? "80px" : "60px",
              letterSpacing: ".2rem",
              fontFamily: "act-of-creation",
            }}
          >
            {splitTextIntoWords("MAXIMIZE YOUR CREATIVITY", scrollingUp)}
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppDemoSection = ({ scrollContainerRef, scrollingUp }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const totalHeight =
          scrollContainerRef.current.scrollHeight - containerHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;

        const showPercentage = 20; // Adjust these values based on your needs
        const hidePercentage = 70; // Adjust these values based on your needs

        if (
          scrollPercentage > showPercentage &&
          scrollPercentage < hidePercentage
        ) {
          setShowText(true);
        } else {
          setShowText(false);
        }
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
    <div
      style={{
        position: "absolute",
        zIndex: "1000",
        display: scrollingUp ? "none" : "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: "70vh", // Adjust position as needed
      }}
    >
      <AnimatePresence>
        {showText && (
          <motion.h1
            className="app-demo-text"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
              exit: { opacity: 0, y: 20 },
            }}
            style={{
              color: "black",
              filter: "invert(1)",
              fontSize: window.innerWidth > 800 ? "70px" : "50px",
              letterSpacing: ".2rem",
              fontFamily: "act-of-creation",
            }}
          >
            {splitTextIntoWords("APP DEMO SECTION", scrollingUp)}
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
};

const Home = () => {
  const scrollContainerRef = useRef(null);
  const [splineOpacity, setSplineOpacity] = useState(1);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const smoothScrollToTop = () => {
    setScrollingUp(true);
    scrollContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const totalHeight =
          scrollContainerRef.current.scrollHeight - containerHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        console.log("scroll", scrollPercentage);

        if (scrollPercentage > 80) {
          setSplineOpacity(0);
        } else {
          setSplineOpacity(1);
        }

        if (
          scrollPosition < prevScrollPos &&
          scrollPercentage > 6 &&
          !scrollingUp
        ) {
          smoothScrollToTop();
        }

        setPrevScrollPos(scrollPosition);
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
  }, [scrollContainerRef, prevScrollPos, scrollingUp]);

  useEffect(() => {
    if (scrollingUp) {
      const handleScrollEnd = () => {
        setScrollingUp(false);
      };

      scrollContainerRef.current.addEventListener("scrollend", handleScrollEnd);
      return () => {
        scrollContainerRef.current.removeEventListener(
          "scrollend",
          handleScrollEnd
        );
      };
    }
  }, [scrollingUp]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {windowWidth > 800 ? (
        <>
          <HomeNav />
          <HeroSection
            scrollContainerRef={scrollContainerRef}
            scrollingUp={scrollingUp}
          />
          <AppDemoSection
            scrollContainerRef={scrollContainerRef}
            scrollingUp={scrollingUp}
          />
          <ProductShotSection
            scrollContainerRef={scrollContainerRef}
            scrollingUp={scrollingUp}
          />
          <h1 style={{ position: "absolute", filter: "invert(1)" }}>
            {" "}
            TESTSETSETSE{" "}
          </h1>
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              opacity: splineOpacity,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: splineOpacity }}
            transition={{ duration: 0.5 }}
          >
            <Spline scene="https://prod.spline.design/8Ir-h4Kft1RZgwFO/scene.splinecode" />
          </motion.div>
          <div
            ref={scrollContainerRef}
            style={{
              height: "100vh",
              overflowY: "scroll",
              position: "relative",
              zIndex: 1,
              // pointerEvents: "none",
            }}
          >
            <div style={{ height: "800vh" }}></div>{" "}
            {/* Extra content for scrolling */}
          </div>
        </>
      ) : (
        <div style={{ height: "100vh" }}>
          <HomeNavMobile />
          {/* <HomeNav /> */}
          <HomeMobile />
        </div>
      )}
    </div>
  );
};

export default Home;
