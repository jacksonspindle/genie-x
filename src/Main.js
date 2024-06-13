import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import Orders from "./components/Orders";
import HoodieCollection from "./components/Collection";
import Nav from "./components/Nav";
import Cart from "./components/Cart";
import { AnimatePresence, motion } from "framer-motion";
import Account from "./components/Account";
import MyImageEditor from "./components/MyImageEditor";
import Gallery from "./components/Gallery";
import ImageEditor2 from "./components/ImageEditor2";
import BigHoodieLiveFeed from "./components/BigHoodieLiveFeed";
import OrderComplete from "./components/OrderComplete";
import { Suspense } from "react";
import Home from "./components/Home";
import { TRANSITION_DURATION, PageTransition } from "./App";

export const Main = ({
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

  function ConditionalNav() {
    return (
      <motion.div
        key="nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: TRANSITION_DURATION }}
        style={{
          height:
            location.pathname === "/" ||
            location.pathname === "/big-hoodie-live-feed"
              ? 0
              : "auto",
          overflow: "hidden",
        }}
      >
        {location.pathname !== "/" &&
          location.pathname !== "/big-hoodie-live-feed" && (
            <Nav
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
      {/* <AnimatePresence mode="wait">
              <ConditionalNav />
            </AnimatePresence>
            <PageTransition>
              <ConditionalNav />
            </PageTransition> */}
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
          <Route
            exact
            path="/login"
            element={
              <PageTransition>
                <Auth />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};
