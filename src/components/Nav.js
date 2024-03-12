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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const dropdownVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 10 },
};

const Nav = ({
  setToggleLogInPage,
  signedIn,
  setSignedIn,
  setCurrentProfilePic,
  currentProfilePic,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const accountRef = useRef(null);
  const [profilePic, setProfilePic] = useState(currentProfilePic);

  useEffect(() => {
    setProfilePic(currentProfilePic);
    console.log(profilePic, "profilepic");
  }, [currentProfilePic]);

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
    clearTimeout(hoverTimeoutRef.current);
    const auth = getAuth();
    try {
      await signOut(auth);
      setSignedIn(false); // Update the signedIn state
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const hoverTimeoutRef = useRef();

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  useEffect(() => {
    const checkIfOutsideBounds = (e) => {
      if (!isHovered) return;

      const profilePic = document.querySelector('img[alt="profile-pic"]');
      const dropdownMenu = document.querySelector(".drop-down-menu");

      if (!profilePic || !dropdownMenu) {
        setIsHovered(false);
        return;
      }

      const profilePicRect = profilePic.getBoundingClientRect();
      const dropdownRect = dropdownMenu.getBoundingClientRect();

      const outsideProfilePic =
        e.clientX < profilePicRect.left ||
        e.clientX > profilePicRect.right ||
        e.clientY < profilePicRect.top ||
        e.clientY > profilePicRect.bottom + 30;

      const outsideDropdown =
        e.clientX < dropdownRect.left ||
        e.clientX > dropdownRect.right ||
        e.clientY < dropdownRect.top ||
        e.clientY > dropdownRect.bottom;

      if (outsideProfilePic && outsideDropdown) {
        setIsHovered(false);
      }
    };

    if (isHovered) {
      window.addEventListener("mousemove", checkIfOutsideBounds);
    }

    return () => {
      window.removeEventListener("mousemove", checkIfOutsideBounds);
    };
  }, [isHovered]);

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
                  to="/account"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                >
                  <img
                    onMouseEnter={handleMouseEnter}
                    src={profilePic}
                    alt="profile-pic"
                    style={{
                      width: "50px",
                      position: "absolute",
                      top: 3,
                      right: window.innerWidth < 1600 ? 15 : 40,
                      borderRadius: "50%",
                      zIndex: "10",
                    }}
                  />
                </Link>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="drop-down-menu"
                      // Your styling here
                    >
                      <li>
                        <Link>Orders</Link>
                      </li>
                      <li>
                        <Link to={"/account"}>Account</Link>
                      </li>
                      <li>
                        <Link onClick={handleLogout}>Signout</Link>
                      </li>
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
