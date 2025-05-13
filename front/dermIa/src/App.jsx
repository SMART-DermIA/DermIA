import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from './home/home';
import UserAccueil from './userAccueil/userAccueil';
import Historique from './historique/historique';
import Album from './album/album';
import Settings from "./settings/settings";

import './services/i18n'; 
import './App.css';
import {AuthProvider} from "./auth/authContext.jsx";
import {RequireAuth, RequireGuest} from "./auth/guards.jsx";
import NotFound from "./NotFound.jsx";

function App() {
  return (
  <div className="App">
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
    />
    <Router>
      <Routes>
        <Route element={ <RequireGuest /> }>
          <Route path="/" element={<HomePage/>}/>
        </Route>

        <Route element={ <RequireGuest /> }>
          <Route path="/userAccueil" element={<UserAccueil/>}/>
          <Route path="/historique" element={<Historique/>}/>
          <Route path="/historique/:id" element={<Album />}/>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all: redirect unknown routes */}
        <Route path="*" element={ <NotFound /> } />
      </Routes>
    </Router>
  </div>
  );
}

export default App;