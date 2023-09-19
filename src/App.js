import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";
import "./styles/prompting.css";
import "./styles/login.css";
import "./styles/toast-notifications.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HoodieCollection from "./components/Collection";
import { useEffect, useState, useRef } from "react";
import Nav from "./components/Nav";
import { Gradient } from "./Gradient";

// import Login from "./components/Login";

function App() {
  const gradient = new Gradient();
  const [hoodieImage, setHoodieImage] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [toggleLogInPage, setToggleLogInPage] = useState(false);

  useEffect(() => {
    console.log(signedIn);
  });

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      console.log(ref);
      gradient.initGradient("#gradient-canvas");
    }
  }, [ref, gradient]);

  return (
    <div className="App" ref={ref}>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in />

      <Nav
        setToggleLogInPage={setToggleLogInPage}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
      />
      {toggleLogInPage ? (
        <Auth
          setSignedIn={setSignedIn}
          setToggleLogInPage={setToggleLogInPage}
        />
      ) : null}
      <Router>
        {/* {!signedIn ? <Auth setSignedIn={setSignedIn} /> : null} */}
        <Routes>
          <Route
            exact
            path="/"
            element={
              <DesignPortal
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
        </Routes>
      </Router>

      <style></style>
    </div>
  );
}

export default App;
