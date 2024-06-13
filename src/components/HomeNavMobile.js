import React, { useState } from "react";
import { motion } from "framer-motion";
import aIcon from "../assets/A_Icon.png";
import { Link, useLocation } from "react-router-dom";

const navVariants = {
  closed: {
    width: 80,
    padding: 0,
    height: 80,
  },
  open: {
    width: "100%",
    maxWidth: 370,
    padding: "0 ",
  },
};

const containerVariants = {
  closed: {},
  open: {
    transition: {
      delayChildren: 0.3, // Delay before children start their animation
      staggerChildren: 0.2, // Stagger effect based on index
    },
  },
};

const itemsVariants = {
  closed: { opacity: 0, pointerEvents: "none" },
  open: {
    opacity: 1,
    x: 0,
    pointerEvents: "all",
    transition: {
      duration: 0.5,
    },
  },
};

const HomeNavMobile = ({ setSignedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const containerClass =
    location.pathname === "/"
      ? "home-nav-container-no-glow-mobile"
      : "home-nav-container-mobile";

  const showOverlay = location.pathname === "/design" && isOpen;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to parent elements
    if (!isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleOverlayClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className={`overlay ${showOverlay ? "visible" : ""}`}
          onClick={handleOverlayClick}
        />
      ) : null}
      <motion.div
        className={containerClass}
        onClick={handleToggle}
        animate={isOpen ? "open" : "closed"}
        variants={navVariants}
        initial="closed"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="nav-icon" onClick={(e) => e.stopPropagation()}>
          {isOpen ? (
            <Link to={"/"}>
              <img
                style={{ cursor: "pointer", width: 80, height: 80 }}
                src={aIcon}
                className="a-icon"
                alt="icon"
              />
            </Link>
          ) : (
            <img
              style={{ cursor: "pointer", width: 80, height: 80 }}
              src={aIcon}
              className="a-icon"
              alt="icon"
              onClick={handleIconClick}
            />
          )}
        </div>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="closed"
            animate="open"
            style={{
              display: "flex",
              marginLeft: location.pathname === "/" ? "1rem" : "0",
            }}
          >
            <motion.div
              className="nav-item small-text"
              variants={itemsVariants}
            >
              <Link to={"/design"}>Design</Link>
            </motion.div>
            <motion.div
              className="nav-item small-text"
              variants={itemsVariants}
            >
              <Link to={"/LiveFeed"}>Live Feed</Link>
            </motion.div>
            <motion.div
              className="nav-item small-text"
              variants={itemsVariants}
            >
              <Link to={"/login"}>Sign In</Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default HomeNavMobile;
