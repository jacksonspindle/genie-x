import React from "react";
import { Auth } from "./auth";
import { Link } from "react-router-dom";

const Nav = ({ setToggleLogInPage, signedIn, setSignedIn }) => {
  return (
    <div>
      <nav className="">
        <ul className="nav-container">
          <div>
            <Link
              style={{ backgroundColor: "transparent", color: "white" }}
              to="/"
            >
              Home
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
              <Link
                style={{ backgroundColor: "transparent", color: "white" }}
                to="/account"
              >
                Account
              </Link>
            ) : (
              <span
                style={{ backgroundColor: "transparent", color: "white" }}
                to="/"
                onClick={() => setToggleLogInPage(true)}
              >
                Sign In
              </span>
            )}
            <Link style={{ backgroundColor: "transparent", color: "white" }}>
              Cart
            </Link>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
