import React, { useEffect, useState, useRef } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";
import "./styles/cart.css";
import "./styles/prompting.css";
import "./styles/login.css";
import "./styles/home-nav.css";
import "./styles/orders.css";
import "./styles/toast-notifications.css";
import "./styles/gallery.css";
import "./styles/account.css";
import "./styles/image-editor.css";
import "./styles/image-editor-2.css";
import "./styles/product-details.css";
import "./styles/user-designs.css";
import "./styles/asset-library.css";
import "./styles/upload-image.css";
import "./styles/big-hoodie-live-feed.css";
import Orders from "./components/Orders";
import HoodieCollection from "./components/Collection";
import Nav from "./components/Nav";
import { Gradient } from "./Gradient";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import { AnimatePresence, motion } from "framer-motion";
import Account from "./components/Account";
import defaultProfile from "./assets/defaultProfile.webp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MyImageEditor from "./components/MyImageEditor";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase";
import Gallery from "./components/Gallery";
import ImageEditor2 from "./components/ImageEditor2";
import BigHoodieLiveFeed from "./components/BigHoodieLiveFeed";
import OrderComplete from "./components/OrderComplete";
import { Suspense } from "react";
import Home from "./components/Home";
import HomeNav from "./components/HomeNav";
import HomeNavMobile from "./components/HomeNavMobile";

const TRANSITION_DURATION = 0.75; // Set a consistent transition duration

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: TRANSITION_DURATION, delay: 1 }}
  >
    {children}
  </motion.div>
);

function App() {
  const gradient = new Gradient();
  const [hoodieImage, setHoodieImage] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [toggleLogInPage, setToggleLogInPage] = useState(false);
  const [productDetails, setProductDetails] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState(defaultProfile);
  const [triggerProfilePicChange, setTriggerProfilePicChange] = useState(1);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const ref = useRef();

  useEffect(() => {
    console.log("newHoodieImage:", hoodieImage);
  }, [hoodieImage]);

  useEffect(() => {
    if (ref.current && location.pathname !== "/") {
      gradient.initGradient("#gradient-canvas");
    }
  }, [ref, location.pathname]);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("User is logged in, fetching current profile pic...");
  //       setSignedIn(true);
  //       const userRef = doc(db, "users", user.uid);
  //       const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
  //         const userData = doc.data();
  //         const currentPic = userData?.currentProfilePic || defaultProfile;
  //         setCurrentProfilePic(currentPic);
  //       });
  //       return () => unsubscribeSnapshot();
  //     } else {
  //       setSignedIn(false);
  //       console.log("No user logged in.");
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  console.log(setSignedIn, "setsignedin");

  return (
    <div className="App" ref={ref}>
      <AnimatePresence>
        {productDetails ? (
          <ProductDetails setProductDetails={setProductDetails} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {location.pathname !== "/" && (
          <motion.canvas
            id="gradient-canvas"
            data-js-darken-top
            data-transition-in
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRANSITION_DURATION }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toggleLogInPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRANSITION_DURATION }}
          >
            <Auth
              setSignedIn={setSignedIn}
              setToggleLogInPage={setToggleLogInPage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Main
        currentProfilePic={currentProfilePic}
        setCurrentProfilePic={setCurrentProfilePic}
        setToggleLogInPage={setToggleLogInPage}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        setHoodieImage={setHoodieImage}
        hoodieImage={hoodieImage}
      />
    </div>
  );
}

const Main = ({
  currentProfilePic,
  setCurrentProfilePic,
  setToggleLogInPage,
  signedIn,
  setSignedIn,
  productDetails,
  setProductDetails,
  setHoodieImage,
  hoodieImage,
  triggerProfilePicChange,
  setTriggerProfilePicChange,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function ConditionalNav() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
    const location = useLocation();

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 500);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return (
      <motion.div
        key="nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75 }}
        style={{
          height:
            location.pathname === "/" ||
            location.pathname === "/big-hoodie-live-feed"
              ? 0
              : "auto",
          position: "absolute",
          width: "100%",
        }}
      >
        {isMobile ? (
          <HomeNavMobile
            currentProfilePic={currentProfilePic}
            setCurrentProfilePic={setCurrentProfilePic}
            setToggleLogInPage={setToggleLogInPage}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
          />
        ) : (
          <HomeNav
            currentProfilePic={currentProfilePic}
            setCurrentProfilePic={setCurrentProfilePic}
            setToggleLogInPage={setToggleLogInPage}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
          />
        )}
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <ConditionalNav
          setSignedIn={setSignedIn}
          setToggleLogInPage={setToggleLogInPage}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            exact
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />

          <Route
            exact
            path="/design"
            element={
              <PageTransition>
                <DesignPortal
                  isMobile={isMobile}
                  productDetails={productDetails}
                  setProductDetails={setProductDetails}
                  setHoodieImage={setHoodieImage}
                  hoodieImage={hoodieImage}
                  setSignedIn={setSignedIn}
                  setToggleLogInPage={setToggleLogInPage}
                />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/collection"
            element={
              <PageTransition>
                <HoodieCollection
                  setHoodieImage={setHoodieImage}
                  hoodieImage={hoodieImage}
                />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/cart"
            element={
              <PageTransition>
                <Cart
                  setHoodieImage={setHoodieImage}
                  hoodieImage={hoodieImage}
                />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/account"
            element={
              signedIn ? (
                <PageTransition>
                  <Account
                    setTriggerProfilePicChange={setTriggerProfilePicChange}
                    setCurrentProfilePic={setCurrentProfilePic}
                    currentProfilePic={currentProfilePic}
                  />
                </PageTransition>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            exact
            path="/gallery"
            element={
              <PageTransition>
                <Gallery />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/LiveFeed"
            element={
              <Suspense>
                <PageTransition>
                  <BigHoodieLiveFeed />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            exact
            path="/success"
            element={
              <PageTransition>
                <OrderComplete />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/image-editor-2"
            element={
              <PageTransition>
                <ImageEditor2 />
              </PageTransition>
            }
          />
          <Route
            exact
            path="/orders"
            element={
              <PageTransition>
                <Orders />
              </PageTransition>
            }
          />
          <Route
            path="/test-image-editor"
            element={
              <PageTransition>
                <MyImageEditor />
              </PageTransition>
            }
          />
          {console.log("setsignedinnnnn", setSignedIn)}
          <Route
            exact
            path="/login"
            element={
              <PageTransition>
                <Auth setSignedIn={setSignedIn} />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
