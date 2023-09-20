import React from "react";
// import { Auth } from "./auth";

const Nav = ({ setToggleLogInPage, signedIn, setSignedIn }) => {
  return (
    <div>
      <nav className="">
        <ul className="nav-container">
          <div>
            <li>Home</li>
            <li>Design</li>
          </div>
          <div>
            {signedIn ? (
              <li>Account</li>
            ) : (
              <li onClick={() => setToggleLogInPage(true)}>Sign In</li>
            )}
            <li>Cart</li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
