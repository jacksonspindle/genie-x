import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";
import "./styles/cart.css";
import "./styles/prompting.css";
import "./styles/login.css";
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
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import HoodieCollection from "./components/Collection";
import { useEffect, useState, useRef, Suspense } from "react";
import Nav from "./components/Nav";
import { Gradient } from "./Gradient";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import { AnimatePresence, motion } from "framer-motion";
import Account from "./components/Account";
import defaultProfile from "./assets/defaultProfile.webp";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import MyImageEditor from "./components/MyImageEditor";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase";
import Gallery from "./components/Gallery";
import ImageEditor2 from "./components/ImageEditor2";
import BigHoodieLiveFeed from "./components/BigHoodieLiveFeed";

function App() {
  const gradient = new Gradient();
  const [hoodieImage, setHoodieImage] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [toggleLogInPage, setToggleLogInPage] = useState(false);
  const [productDetails, setProductDetails] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState(defaultProfile);
  const [triggerProfilePicChange, setTriggerProfilePicChange] = useState(1);

  useEffect(() => {
    console.log("newHoodieImage:", hoodieImage);
  }, [hoodieImage]);

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      gradient.initGradient("#gradient-canvas");
    }
  }, [ref]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in, fetching current profile pic...");

        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
          const userData = doc.data();
          const currentPic = userData.currentProfilePic || defaultProfile;
          console.log("this is running", currentPic);

          setCurrentProfilePic(currentPic);
        });
        return () => unsubscribe();
      } else {
        console.log("No user logged in.");
      }
    });
  }, []);

  function ConditionalNav() {
    const location = useLocation();
    if (location.pathname === "/big-hoodie-live-feed") {
      return null;
    }
    return (
      <Nav
        currentProfilePic={currentProfilePic}
        setCurrentProfilePic={setCurrentProfilePic}
        setToggleLogInPage={setToggleLogInPage}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
      />
    );
  }

  return (
    <div className="App" ref={ref}>
      <AnimatePresence>
        {productDetails ? (
          <ProductDetails setProductDetails={setProductDetails} />
        ) : null}
      </AnimatePresence>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in />

      <AnimatePresence>
        {toggleLogInPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Auth
              setSignedIn={setSignedIn}
              setToggleLogInPage={setToggleLogInPage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Router>
        <ConditionalNav />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <DesignPortal
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                setHoodieImage={setHoodieImage}
                hoodieImage={hoodieImage}
                setSignedIn={setSignedIn}
                setToggleLogInPage={setToggleLogInPage}
              />
            }
          />
          <Route
            exact
            path="/design"
            element={
              <DesignPortal
                productDetails={productDetails}
                setProductDetails={setProductDetails}
                setHoodieImage={setHoodieImage}
                hoodieImage={hoodieImage}
                setSignedIn={setSignedIn}
                setToggleLogInPage={setToggleLogInPage}
              />
            }
          />
          <Route
            exact
            path="/collection"
            element={
              <HoodieCollection
                setHoodieImage={setHoodieImage}
                hoodieImage={hoodieImage}
              />
            }
          />
          <Route
            exact
            path="/cart"
            element={
              <Cart setHoodieImage={setHoodieImage} hoodieImage={hoodieImage} />
            }
          />
          <Route
            exact
            path="/account"
            element={
              <Account
                setTriggerProfilePicChange={setTriggerProfilePicChange}
                setCurrentProfilePic={setCurrentProfilePic}
                currentProfilePic={currentProfilePic}
              />
            }
          />
          <Route exact path="/gallery" element={<Gallery />} />
          <Route
            exact
            path="/LiveFeed"
            element={
              <Suspense>
                <BigHoodieLiveFeed />
              </Suspense>
            }
          />
          <Route exact path="/image-editor-2" element={<ImageEditor2 />} />
          <Route exact path="/orders" element={<Orders />} />
          <Route path="/test-image-editor" element={<MyImageEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
