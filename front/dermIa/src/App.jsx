import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./home/home";
import UserAccueil from "./userAccueil/userAccueil";
import Historique from "./historique/historique";
import Settings from "./settings/settings";
import Album from "./album/album";

import "./services/i18n";
import "./App.css";
import { useAuth } from "./AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/userAccueil" replace /> : <Home />}
            />
            <Route path="/userAccueil" element={<UserAccueil />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/historique/:id" element={<Album />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
