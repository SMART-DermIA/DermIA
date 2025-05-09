import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/navBar/navbar";
import Footer from "./components/footer/footer";
import HomePage from "./home/home";
import UserAccueil from "./userAccueil/userAccueil";
import Historique from "./historique/historique";

function App() {
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
            <Route path="/" element={<HomePage />} />
            <Route path="/userAccueil" element={<UserAccueil />} />
            <Route path="/historique" element={<Historique />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
