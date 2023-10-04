import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls, Environment } from "@react-three/drei";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase"; // Import Firebase auth and db
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const itemPrice = 120; // Price per item

  const fetchCartImage = async (imageUrl, token) => {
    try {
      const response = await axios.get(
        `https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/cart-proxy?imageUrl=${encodeURIComponent(
          imageUrl
        )}&token=${token}`
      );

      return response.data.imageUrl;
    } catch (error) {
      throw new Error("Failed to fetch cart image");
    }
  };

  const fetchCartItems = async () => {
    if (auth.currentUser) {
      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      const docSnapshot = await getDoc(userCartRef);

      if (docSnapshot.exists()) {
        const cartData = docSnapshot.data();
        // Assuming cartData.items is an array of cart items
        setCartItems(cartData.items || []);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  function SetupCamera() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.z = 9; // Set the initial position of the camera
      camera.updateProjectionMatrix();
    }, [camera]);

    return null; // This component doesn't render anything visually
  }
  return (
    <div className="cart-container-outer">
      <div className="cart-container">
        {cartItems.map((item, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                // backgroundColor: "aqua",
                width: "100%",
                display: "flex",
                gap: "8rem",
                // justifyContent: "center",
                // justifyContent: "space-between",
                // justifyContent: "space-around",
                // borderRadius: "2rem",
              }}
            >
              <div
                className="canvas-column"
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div className="cart-hoodie-canvas">
                  <Canvas className="canvas-checkout">
                    <SetupCamera />
                    <Hoodie
                      hoodieImage={fetchCartImage(item.imageUrl, item.token)}
                    />
                    <OrbitControls
                      enablePan={true}
                      target={[0, 0.8, 0]}
                      zoomSpeed={0.5}
                      maxDistance={13}
                      minDistance={4}
                    />
                    <Environment preset="city" />
                  </Canvas>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    width: "100%",
                    marginRight: "0%",
                  }}
                >
                  <h1>Infinity Hoodie / L / WHITE</h1>
                </div>
              </div>

              <div className="cart-info-container" style={{ flex: 2 }}>
                <table className="cart-table-row-1">
                  <thead>
                    <tr>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Size</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr key={index}>
                      <td
                        style={{
                          fontFamily: "oatmeal-pro-thin",
                          opacity: ".5",
                        }}
                      >
                        ${itemPrice}
                      </td>
                      <td
                        style={{
                          fontFamily: "oatmeal-pro-thin",
                          opacity: ".5",
                        }}
                      >
                        1
                      </td>
                      <td
                        style={{
                          fontFamily: "oatmeal-pro-thin",
                          opacity: ".5",
                        }}
                      >
                        L
                      </td>
                      <td
                        style={{
                          fontFamily: "oatmeal-pro-thin",
                          opacity: ".5",
                        }}
                      >
                        ${itemPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <hr
              style={{
                // height: "2rem",
                color: "white",
                border: ".1rem solid gray",
                width: "100%",
              }}
            ></hr>
          </React.Fragment>
        ))}

        <div>
          <div className="lower-row-container" style={{ display: "flex" }}>
            <div style={{ flex: 1, width: "100%" }} className="left-size"></div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                marginTop: "3rem",
              }}
              className="right-side"
            >
              <table className="cart-table-row-2">
                <thead>
                  <tr>
                    <th>Subtotal</th>
                    <th
                      style={{ fontFamily: "oatmeal-pro-thin", opacity: ".5" }}
                    >
                      ${itemPrice * cartItems.length}
                    </th>
                  </tr>
                </thead>
              </table>
              <hr
                style={{
                  color: "white",
                  border: ".1rem solid gray",
                  width: "100%",
                }}
              ></hr>
              <table className="cart-table-row-3">
                <thead>
                  <tr>
                    <th>Shipping</th>
                    <th
                      style={{
                        fontFamily: "oatmeal-pro-thin",
                        opacity: ".5",
                      }}
                    >
                      FREE
                    </th>
                  </tr>
                </thead>
              </table>
              <hr
                style={{
                  color: "white",
                  border: ".1rem solid gray",
                  width: "100%",
                }}
              ></hr>
              <div
                style={{
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: "100%",
                    textAlign: "center",
                    color: "#5300FF",
                  }}
                >
                  + 30 free credits applied to your account
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <button
                  className="apply-image-btn"
                  style={{
                    width: "80%",
                    backgroundColor: "#4a90e2",
                    color: "white",
                    border: "none",
                  }}
                >
                  Checkout
                </button>
                <Link
                  to={"/design"}
                  className="apply-image-btn"
                  style={{
                    width: "80%",
                    backgroundColor: "#5300FF",
                    color: "white",
                    border: "none",
                  }}
                >
                  Keep Designing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
