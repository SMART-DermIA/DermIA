import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "../../login/login";
import Register from "../../register/register";
import "./navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../AuthContext";

export default function Navbar() {
  const [language, setLanguage] = useState("FR");
  const [showNavbar, setShowNavbar] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  let lastScrollY = 0;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
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

  const openLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          showNavbar ? "visible" : "hidden"
        }`}
      >
        <div className="container-fluid d-flex justify-content-between">
          <Link to={user ? "/userAccueil" : "/"} className="navbar-brand">
            <img
              src="/logo.png"
              alt="DermIA Logo"
              style={{ height: "100px" }}
            />
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
              {user ? (
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
                      onClick={logout}
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
            {user && (
              <li className="nav-item user-menu">
                <FaUserCircle
                  size={30}
                  onClick={toggleUserMenu}
                  style={{ cursor: "pointer" }}
                />
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiSettings style={{ marginRight: "8px" }} />
                      Paramètres
                    </Link>
                    <Link to="/" className="dropdown-item" onClick={logout}>
                      <FiLogOut style={{ marginRight: "8px" }} />
                      Se déconnecter
                    </Link>
                  </div>
                )}
              </li>
            )}
          </div>
        </div>
      </nav>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={closeLoginPopup}>
              &times;
            </button>
            <Login
              closePopup={closeLoginPopup}
              openRegisterPopup={handleRegisterClick}
            />
          </div>
        </div>
      )}

      {showRegisterPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={closeRegisterPopup}>
              &times;
            </button>
            <Register
              closePopup={closeRegisterPopup}
              openLoginPopup={openLoginPopup}
            />
          </div>
        </div>
      )}
    </>
  );
}
