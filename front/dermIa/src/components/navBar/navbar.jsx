import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../../login/login";
import Register from "../../register/register";
import "./navbar.css";

export default function Navbar({ passPopupHandlers }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("FR");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const location = useLocation();
  let lastScrollY = 0;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    localStorage.setItem("language", lang);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 991) { // Solo aplicar efecto en desktop
        if (window.scrollY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        lastScrollY = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "EN";
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage.toLowerCase());
  }, []);

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
      <nav className={`navbar navbar-expand-lg ${showNavbar ? "visible" : "hidden"}`}>
        <div className="container-fluid">
          <Link to={isAuthenticated ? "/userAccueil" : "/"} className="navbar-brand">
            <img src="/logo.png" alt="DermIA Logo" className="navbar-logo" />
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
            <div className="d-lg-flex justify-content-between w-100">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {isAuthenticated ? (
                  <>
                    <li className={`nav-item ${location.pathname === "/userAccueil" ? "active" : ""}`}>
                      <Link to="/userAccueil" className="nav-elem">
                        {t("navbar.home")}
                      </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/historique" ? "active" : ""}`}>
                      <Link to="/historique" className="nav-elem">
                        {t("navbar.history")}
                      </Link>
                    </li>
                  </>
                ) : (
                  <div className="mobile-spacer"></div>
                )}
              </ul>
              
              <ul className="navbar-nav ms-auto">
                {isAuthenticated ? (
                  <li className="nav-item">
                    <Link to="/" className="nav-link nav-link-secondary" onClick={handleLogout}>
                      {t("navbar.logout")}
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <button className="nav-link nav-link-primary" onClick={openLoginPopup}>
                        {t("navbar.login")}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link nav-link-secondary" onClick={openRegisterPopup}>
                        {t("navbar.register")}
                      </button>
                    </li>
                  </>
                )}
              </ul>
              
              <div className="d-flex align-items-center ms-lg-3 language-selector">
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
        </div>
      </nav>

      {(showLoginPopup || showRegisterPopup) && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-popup" onClick={showLoginPopup ? closeLoginPopup : closeRegisterPopup}>
              &times;
            </button>
            {showLoginPopup && (
              <Login
                closePopup={closeLoginPopup}
                openRegisterPopup={openRegisterPopup}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
            {showRegisterPopup && (
              <Register
                closePopup={closeRegisterPopup}
                openLoginPopup={openLoginPopup}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}