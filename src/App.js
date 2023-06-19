import "./App.css";
import { Auth } from "./components/auth";
import DesignPortal from "./components/DesignPortal";
import "./styles/design-portal.css";
import "./styles/genie-chat.css";

function App() {
  return (
    <div className="App">
      <Auth />

      <DesignPortal />
    </div>
  );
}

export default App;
