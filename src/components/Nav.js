import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import genieXLogo from "../assets/genieXLogo.png";
import genieXLogo2 from "../assets/genieXLogo2.png";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 10 },
};

const Nav = ({ setToggleLogInPage, signedIn, setSignedIn }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const accountRef = useRef(null);

  useEffect(() => {
    if (isHovered && accountRef.current) {
      const rect = accountRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left + rect.width / 2 - 35, // centering dropdown below "Account"
      });
    }
  }, [isHovered]);

  return (
    <div>
      <nav className="">
        <ul className="nav-container">
          <div>
            <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/"
            >
              <img
                src={genieXLogo2}
                alt="logo"
                width={190}
                style={{ position: "absolute", top: 0 }}
              />
            </Link>
            <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/design"
            >
              Design
            </Link>
          </div>
          <div>
            {signedIn ? (
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                ref={accountRef}
              >
                <Link
                  style={{ backgroundColor: "transparent", color: "white" }}
                  to="/account"
                >
                  Account
                </Link>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      style={{
                        zIndex: "100",
                        position: "fixed",
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: "translateX(-50%)", // centering dropdown
                        backgroundColor: "rgba(255, 255, 255, .9)",
                        color: "black",
                        borderRadius: "5px",
                        padding: "10px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: ".7rem",
                      }}
                    >
                      <Link
                        to="/orders"
                        style={{
                          width: "100%",
                          background: "transparent",
                        }}
                      >
                        Orders
                      </Link>
                      <Link
                        style={{ width: "100%", background: "transparent" }}
                        onClick={() => setSignedIn(false)}
                      >
                        Logout
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <span
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  fontSize: 20,
                }}
                onClick={() => setToggleLogInPage(true)}
              >
                Sign In
              </span>
            )}
            <Link
              to={"/cart"}
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              Cart
            </Link>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
