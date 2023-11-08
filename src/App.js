import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";
import "./styles/cart.css";
import "./styles/prompting.css";
import "./styles/login.css";
import "./styles/toast-notifications.css";
import "./styles/image-editor.css";
import "./styles/product-details.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HoodieCollection from "./components/Collection";
import { useEffect, useState, useRef } from "react";
import Nav from "./components/Nav";
import { Gradient } from "./Gradient";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import { AnimatePresence } from "framer-motion";

// import Login from "./components/Login";

function App() {
  const gradient = new Gradient();
  const [hoodieImage, setHoodieImage] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [toggleLogInPage, setToggleLogInPage] = useState(false);
  const [productDetails, setProductDetails] = useState(false);

  useEffect(() => {
    console.log(signedIn);
  });

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      console.log(ref);
      gradient.initGradient("#gradient-canvas");
    }
    // eslint-disable-next-line no-unused-vars
  }, [ref]);

  return (
    <div className="App" ref={ref}>
      <AnimatePresence>
        {productDetails ? (
          <ProductDetails setProductDetails={setProductDetails} />
        ) : null}
      </AnimatePresence>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in />

      {/* <Nav
        setToggleLogInPage={setToggleLogInPage}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
      /> */}
      {toggleLogInPage ? (
        <Auth
          setSignedIn={setSignedIn}
          setToggleLogInPage={setToggleLogInPage}
        />
      ) : null}
      <Router>
        <Nav
          setToggleLogInPage={setToggleLogInPage}
          signedIn={signedIn}
          setSignedIn={setSignedIn}
        />
        {/* {!signedIn ? <Auth setSignedIn={setSignedIn} /> : null} */}
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
        </Routes>
      </Router>

      <style></style>
    </div>
  );
}

export default App;
