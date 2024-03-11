import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import genieXLogo from "../assets/genieXLogo.png";
import genieXLogo2 from "../assets/genieXLogo2.png";
import cart from "../assets/cart.svg";
import actofcreationlogo from "../assets/actofcreationlogo.svg";
import actofcreationicon from "../assets/actofcreationicon.svg";
import { getAuth, signOut } from "firebase/auth";
import defaultProfile from "../assets/defaultProfile.webp";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 10 },
};

const Nav = ({ setToggleLogInPage, signedIn, setSignedIn }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const accountRef = useRef(null);

  useEffect(() => {
    // console.log("isHovered:", isHovered); // Debugging line

    if (isHovered && accountRef.current) {
      const rect = accountRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left + rect.width / 2 - 35, // centering dropdown below "Account"
      });
    }
  }, [isHovered]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setSignedIn(false); // Update the signedIn state
      //  toast("Signed Out!"); // Provide a message to the user
    } catch (error) {
      console.error("Logout failed", error);
      //  toast("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <nav className="">
        <ul className="nav-container">
          <div>
            <Link
              to={"/"}
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                top: 2,
              }}
            >
              <img src={actofcreationicon} width={70} />
            </Link>
            <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/"
            >
              <img
                src={actofcreationlogo}
                alt="logo"
                className="act-of-creation-logo"
                width={490}
                style={{
                  position: "absolute",
                  top: 20,
                  left: window.innerWidth < 1600 ? "34vw" : "38vw",
                }}
              />
            </Link>
            {/* <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/design"
            >
              Design
            </Link> */}
          </div>
          <div style={{ height: 50, width: 200 }}>
            {/*{" "}
            <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/design"
            >
              Design
            </Link>
            */}
            <Link
              className="testlink"
              to={"/cart"}
              style={{
                backgroundColor: "transparent",
                color: "white",
                width: "35px",
                position: "absolute",
                zIndex: "10",
                top: 8,
                right: "1vh",
              }}
            >
              <img src={cart} width={35} className="cartIcon" />
            </Link>
            {signedIn ? (
              <div
                style={{
                  position: "relative",
                  width: "400px",
                }}
                ref={accountRef}
              >
                <Link
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                  to="/account"
                >
                  <img
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    src={defaultProfile}
                    alt="profile-pic"
                    style={{
                      width: "50px",
                      position: "absolute",
                      top: 3,
                      right: window.innerWidth < 1600 ? 15 : 40,
                      borderRadius: "50%",
                    }}
                  />
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
                        position: "absolute",
                        top: `${position.top}px`,
                        right: `${position.right}px`,
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
                        // onClick={() => setSignedIn(false)}
                        onClick={handleLogout}
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
                  position: "absolute",
                  top: 30,
                  right: 50,
                }}
                onClick={() => {
                  setToggleLogInPage(true);
                  setIsHovered(false);
                }}
              >
                Sign In
              </span>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
