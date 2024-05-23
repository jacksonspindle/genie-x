import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Hoodie from "./Hoodie";
import { OrbitControls, Environment } from "@react-three/drei";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase"; // Import Firebase auth and db
import { getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore"; // Import Firestore functions
import axios from "axios";
import { Ring } from "@uiball/loaders";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { NewHoodie } from "./NewGenieXHoodie";
import { Box } from "@react-three/drei";
import frontHoodie from "../assets/frontHoodie.png";
import { loadStripe } from "@stripe/stripe-js";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

const Cart = ({ setHoodieImage }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [overallLoading, setOverallLoading] = useState(true);
  const navigate = useNavigate();
  const [currentHoodieImageUrl, setCurrentHoodieImageUrl] = useState(null);

  const [mouseDownTime, setMouseDownTime] = useState(0);
  const [mouseUpTime, setMouseUpTime] = useState(0);

  const itemPrice = 120; // Price per item
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState({});

  useEffect(() => {
    const initialSizes = {};
    cartItems.forEach((item) => {
      initialSizes[item.id] = "L"; // default size
    });
    setSizes(initialSizes);
  }, [cartItems]);

  const handleSizeChange = (itemId, newSize) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, size: newSize } // Keep the existing quantity
          : item
      )
    );
  };

  useEffect(() => {
    // Initialize quantities for each item in the cart
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = 1; // Assuming each item has a unique 'id'. Adjust as per your data structure.
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Function to increment quantity
  const incrementQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to decrement quantity
  const decrementQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      const userCartRef = doc(db, "carts", auth.currentUser.uid);

      // Update Firestore with the current cartItems state
      const updateFirestoreCart = async () => {
        try {
          await updateDoc(userCartRef, {
            items: cartItems,
          });
        } catch (error) {
          console.error("Error updating cart in Firestore: ", error);
        }
      };

      updateFirestoreCart();
    }
  }, [cartItems]);

  const handleMouseDown = () => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUp = (hoodieImageUrl) => {
    setMouseUpTime(Date.now());
    setCurrentHoodieImageUrl(hoodieImageUrl);
  };

  useEffect(() => {
    const elapsedTime = mouseUpTime - mouseDownTime;
    if (elapsedTime < 200 && elapsedTime > 0) {
      handleHoodieClick(currentHoodieImageUrl);
    }
  }, [mouseUpTime, currentHoodieImageUrl]);

  useEffect(() => {
    if (auth.currentUser) {
      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      // Setting up the real-time listener
      const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const cartData = docSnapshot.data();
          setCartItems(cartData.items || []);
        }
        setCartLoading(false);
      });

      // Returning the unsubscribe function to be called when the component is unmounted
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    console.log("the cart loading", cartLoading);
  }, [cartLoading]);

  const fetchCartImage = async (imageUrl, token) => {
    console.log("IMAGE:", imageUrl, "TOKEN:", token);
    try {
      // console.log(
      //   "request URL: ",
      //   `https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/cart-proxy?imageUrl=${imageUrl}`
      // );
      const encodedImageUrl = encodeURIComponent(imageUrl);
      const response = await axios.get(
        `https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/cart-proxy?imageUrl=${encodedImageUrl}`
      );
      // const response = await axios.get(imageUrl);

      console.log("encoded Image url: ", encodedImageUrl);
      console.log("Response", response);

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
        console.log("Cart Items: ", cartItems);
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

  const [hoodieImageUrls, setHoodieImageUrls] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const imageUrls = await Promise.all(
        cartItems.map((item) => fetchCartImage(item.imageUrl, item.token))
      );
      setHoodieImageUrls(imageUrls);
      setImagesLoading(false);

      // setOverallLoading(false);
    }

    fetchImages();
    // setOverallLoading(false);
  }, [cartItems]);

  setTimeout(() => {
    setOverallLoading(false);
  }, 3000); // 2 second delay

  // setTimeout(() => {
  //   setOverallLoading(false);
  // }, 2000); // 2 second delay

  const handleHoodieClick = (hoodieImageUrl) => {
    setHoodieImage(hoodieImageUrl);
    navigate("/design");
  };

  useEffect(() => {
    async function fetchImages() {
      const imageUrls = await Promise.all(
        cartItems.map((item) => fetchCartImage(item.imageUrl, item.token))
      );
      console.log("Image URLs:", imageUrls); // Log the image URLs here
      setHoodieImageUrls(imageUrls);
      setImagesLoading(false);
    }

    fetchImages();
  }, [cartItems]);

  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      // Use item.quantity directly instead of quantities[item.id]
      subtotal += itemPrice * (item.quantity || 1);
    });
    return subtotal;
  };

  const handleCheckout = async () => {
    // Load Stripe
    const stripeKey =
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_LIVE_SECRET_KEY
        : process.env.REACT_APP_STRIPE_PUBLIC_KEY;

    const stripe = await loadStripe(stripeKey);

    // Get the current user's UID
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // Handle the case where the user is not authenticated
      console.error("User not authenticated.");
      return;
    }

    console.log("user id", auth.currentUser.uid);

    try {
      // Call your Firebase Function to create a checkout session
      const response = await fetch(
        "https://us-central1-geniex-1d1e3.cloudfunctions.net/createCheckoutSession",
        {
          method: "POST",
          body: JSON.stringify({ uid: auth.currentUser.uid }), // Send the UID in the request body
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const session = await response.json();
        console.log("this is logging");
        console.log("session", session);

        // Redirect to the Stripe checkout page
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          console.error(
            "Stripe redirectToCheckout error:",
            result.error.message
          );
          console.log("session", session);
        }
      } else {
        // Handle HTTP errors

        console.error("HTTP error status:", response.status);
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        // Parse and log JSON error object if possible
        try {
          const errorObj = JSON.parse(errorText);
          console.error("Parsed error object:", errorObj);
        } catch (e) {
          console.error("Error parsing error text as JSON.");
        }
      }
    } catch (error) {
      // Handle fetch errors
      console.error("Fetch error:", error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "-30px", x: "0" }}
      animate={{ opacity: 1, y: "0", x: 0 }}
      className={
        overallLoading ? "cart-container-outer-loading" : "cart-container-outer"
      }
    >
      {overallLoading ? (
        <div className="cart-loading-animation">
          <Ring size={40} lineWeight={5} speed={2} color="black" />
        </div>
      ) : (
        <div className="cart-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={backIcon}
              style={{ width: "30px", cursor: "pointer" }}
              alt="back"
              onClick={() => {
                navigate("/design");
              }}
            />
            <h1 style={{ display: "flex", margin: "2rem" }}>My Cart</h1>
            {cartItems.length === 0 && (
              <div className="empty-cart-message">
                <h2>Your cart is currently empty.</h2>
              </div>
            )}
          </div>
          {imagesLoading ? (
            <div>Loading images...</div>
          ) : (
            cartItems.map((item, index) => {
              const dataUri = `data:image/jpeg;base64,${hoodieImageUrls[index]}`;
              const itemId = cartItems;
              console.log("itemID", itemId);
              return (
                <React.Fragment key={index}>
                  <div
                    className="line-item-container"
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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <div
                        className="cart-hoodie-canvas"
                        onMouseDown={handleMouseDown}
                        onMouseUp={() => handleMouseUp(hoodieImageUrls[index])}
                      >
                        {!imagesLoading && hoodieImageUrls.length > 0 && (
                          <div className="cart-images-container">
                            <img
                              src={frontHoodie}
                              className="cart-image-1"
                              alt="image1"
                            />
                            <img
                              className="cart-image-2"
                              src={hoodieImageUrls[index]}
                              alt="image2"
                            />
                          </div>
                        )}
                        {/* {!imagesLoading && hoodieImageUrls.length > 0 && (
                          <Canvas className="canvas-checkout">
                            {console.log(
                              "Inside Canvas JSX:",
                              hoodieImageUrls[0]
                            )}

                            <SetupCamera />
                            <NewHoodie hoodieImage={hoodieImageUrls[0]} />

                            <OrbitControls
                              enablePan={true}
                              target={[0, 0.8, 0]}
                              zoomSpeed={0.5}
                              maxDistance={13}
                              minDistance={4}
                            />
                            <Environment preset="city" />
                          </Canvas>
                        )
                        } */}
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
                        <h1 style={{ opacity: ".6", fontStyle: "italic" }}>
                          Infinity Hoodie / L / WHITE
                        </h1>
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
                          <tr
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                                // marginLeft: "20px",
                              }}
                            >
                              <div className="quantity-button-container">
                                <button
                                  className="quantity-button"
                                  onClick={() => decrementQuantity(item.id)}
                                >
                                  -
                                </button>
                                <span>{item.quantity || 1}</span>
                                <button
                                  className="quantity-button"
                                  onClick={() => incrementQuantity(item.id)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td
                              style={{
                                fontFamily: "oatmeal-pro-thin",
                                opacity: ".5",
                              }}
                            >
                              <select
                                className="size-select"
                                value={item.size}
                                onChange={(e) =>
                                  handleSizeChange(item.id, e.target.value)
                                }
                              >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                              </select>
                            </td>
                            <td
                              style={{
                                fontFamily: "oatmeal-pro-thin",
                                opacity: ".5",
                              }}
                            >
                              ${itemPrice * (item.quantity || 1)}
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
              );
            })
          )}

          <div>
            <div className="lower-row-container" style={{ display: "flex" }}>
              <div
                style={{ flex: 1, width: "100%" }}
                className="left-size"
              ></div>
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
                        style={{
                          fontFamily: "oatmeal-pro-thin",
                          opacity: ".5",
                        }}
                      >
                        ${calculateSubtotal()}
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
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                  <Link
                    to={"/design"}
                    className="apply-image-btn keep-designing-btn"
                    style={{
                      width: "5rem",
                      backgroundColor: "#5300FF",
                      color: "white",
                      border: "none",
                    }}
                    onClick={() => {
                      setHoodieImage(false);
                    }}
                  >
                    Design Another
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
