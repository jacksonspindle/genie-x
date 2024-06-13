import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import aIcon from "../assets/A_Icon.png";
import { Link, useLocation } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.webp";

const navVariants = {
  closed: {
    width: 80,
    padding: 0,
    height: 80,
  },
  open: { width: 500, padding: "0 " },
};

const itemsVariants = {
  closed: { opacity: 0, pointerEvents: "none" },
  open: (i) => ({
    opacity: 1,
    x: 0,
    pointerEvents: "all",
    transition: {
      staggerChildren: 0.5, // Stagger effect based on index
      duration: 0.5,
    },
  }),
};

const HomeNav = ({ signedIn, profilePic, setSignedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const containerClass =
    location.pathname === "/"
      ? "home-nav-container-no-glow"
      : "home-nav-container";

  const showOverlay = location.pathname === "/design" && isOpen;

  return (
    <>
      {isOpen ? (
        <div className={`overlay ${showOverlay ? "visible" : ""}`} />
      ) : null}
      <motion.div
        className={containerClass}
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        animate={isOpen ? "open" : "closed"}
        variants={navVariants}
        initial="closed"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          staggerChildren: 0.2,
        }}
      >
        <div className="nav-icon">
          <Link to={"/"}>
            <img
              style={{ cursor: "pointer" }}
              src={aIcon}
              className="a-icon"
              alt="icon"
            />
          </Link>
        </div>
        {isOpen && (
          <>
            <motion.div className="nav-item" variants={itemsVariants}>
              <Link to={"/design"}>Design</Link>
            </motion.div>
            <motion.div
              className="nav-item"
              variants={itemsVariants}
              transition={{ delay: 0.4 }}
            >
              <Link to={"/LiveFeed"}>Live Feed</Link>
            </motion.div>
            {signedIn ? (
              <motion.div
                className="nav-item"
                variants={itemsVariants}
                transition={{ delay: 1 }}
              >
                <Link to={"/account"}>
                  <img
                    src={profilePic || defaultProfile}
                    alt="profile-pic"
                    style={{
                      width: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                className="nav-item"
                variants={itemsVariants}
                transition={{ delay: 1 }}
              >
                <Link to={"/login"}>Sign In</Link>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </>
  );
};

export default HomeNav;
