import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";
import "./styles/toast-notifications.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HoodieCollection from "./components/Collection";
import { useState } from "react";

function App() {
  const [hoodieImage, setHoodieImage] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  return (
    <div className="App">
      <Router>
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
        {!signedIn ? <Auth setSignedIn={setSignedIn} /> : null}
      </Router>
    </div>
  );
}

export default App;
