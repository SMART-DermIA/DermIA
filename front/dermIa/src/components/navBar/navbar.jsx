import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "../../login/login";
import Register from "../../register/register";
import "./navbar.css";

export default function Navbar() {
  const [language, setLanguage] = useState("FR");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const location = useLocation();
  let lastScrollY = 0;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterPopup(true);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const closeRegisterPopup = () => {
    setShowRegisterPopup(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${showNavbar ? "visible" : "hidden"}`}>
        <div className="container-fluid d-flex justify-content-between">
          <Link to={isAuthenticated ? "/userAccueil" : "/"} className="navbar-brand">
            <img src="/logo.png" alt="DermIA Logo" style={{ height: "100px" }} />
          </Link>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item nav-elem">
                    <Link
                      to="/userAccueil"
                      className={`nav-elem ${
                        location.pathname === "/userAccueil" ? "active" : ""
                      }`}
                    >
                      Accueil
                    </Link>
                  </li>
                  <li className="nav-item nav-elem">
                    <Link
                      to="/historique"
                      className={`nav-elem ${
                        location.pathname === "/historique" ? "active" : ""
                      }`}
                    >
                      Historique
                    </Link>
                  </li>
                  <div className="nav-center"></div>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link nav-link-secondary"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link nav-link-primary"
                      onClick={handleLoginClick}
                    >
                      Se connecter
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link nav-link-secondary"
                      onClick={handleRegisterClick}
                    >
                      S'inscrire
                    </button>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center">
              <span
                className={`nav-lang ${language === "FR" ? "active" : ""}`}
                onClick={() => handleLanguageChange("FR")}
              >
                FR
              </span>
              <span>/</span>
              <span
                className={`nav-lang ${language === "EN" ? "active" : ""}`}
                onClick={() => handleLanguageChange("EN")}
              >
                EN
              </span>
            </div>
          </div>
        </div>
      </nav>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={closeLoginPopup}>
              &times;
            </button>
            <Login closePopup={closeLoginPopup} setIsAuthenticated={setIsAuthenticated} />
          </div>
        </div>
      )}

      {showRegisterPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={closeRegisterPopup}>
              &times;
            </button>
            <Register closePopup={closeRegisterPopup} />
          </div>
        </div>
      )}
    </>
  );
}