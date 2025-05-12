import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../../login/login";
import Register from "../../register/register";
import "./navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/authContext.jsx";

export default function Navbar({ passPopupHandlers }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("FR");
  const [showNavbar, setShowNavbar] = useState(true);

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    localStorage.setItem("language", lang);
  };

  const openLoginPopup = () => {
    setShowLoginPopup(true);
    setShowRegisterPopup(false);
  };

  const openRegisterPopup = () => {
    setShowRegisterPopup(true);
    setShowLoginPopup(false);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const closeRegisterPopup = () => {
    setShowRegisterPopup(false);
  };

  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbarVisibility = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true); // Always show navbar near top
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbarVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "EN";
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage.toLowerCase());
  }, [i18n]);

  useEffect(() => {
    if (passPopupHandlers) {
      passPopupHandlers({
        openLoginPopup,
        openRegisterPopup,
        closeLoginPopup,
        closeRegisterPopup,
        showLoginPopup,
        showRegisterPopup,
      });
    }
  }, [passPopupHandlers, showLoginPopup, showRegisterPopup]);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          showNavbar ? "visible" : "hidden"
        }`}
      >
        <div className="container-fluid d-flex justify-content-between">
          <Link to={isLoggedIn ? "/userAccueil" : "/"} className="navbar-brand">
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
              {isLoggedIn ? (
                <>
                  <li
                    className={`nav-item nav-elem ${
                      location.pathname === "/userAccueil" ? "active" : ""
                    }`}
                  >
                    <Link to="/userAccueil" className="nav-elem">
                      {t("navbar.home")}
                    </Link>
                  </li>
                  <li
                    className={`nav-item nav-elem ${
                      location.pathname === "/historique" ? "active" : ""
                    }`}
                  >
                    <Link to="/historique" className="nav-elem">
                      {t("navbar.history")}
                    </Link>
                  </li>
                  <div className="nav-center"></div>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link nav-link-secondary"
                      onClick={logout}
                    >
                      {t("navbar.logout")}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link nav-link-primary"
                      onClick={openLoginPopup}
                    >
                      {t("navbar.login")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link nav-link-secondary"
                      onClick={openRegisterPopup}
                    >
                      {t("navbar.register")}
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
                      {t("navbar.settings")}
                    </Link>
                    <Link to="/" className="dropdown-item" onClick={logout}>
                      <FiLogOut style={{ marginRight: "8px" }} />
                      {t("navbar.logout")}
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
              openRegisterPopup={openRegisterPopup}
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
