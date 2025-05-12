import React, { useEffect, useState } from "react";
import "./home.css";
import Navbar from "../components/navBar/navbar";
import Footer from "../components/footer/footer";
import Register from "../register/register";

import { FaRegUser } from "react-icons/fa";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { BiStats } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [backendMessage, setBackendMessage] = useState(t("home.loading"));
  const [popupHandlers, setPopupHandlers] = useState(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");

  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then((response) => response.json())
      .then((data) => setBackendMessage(data.message))
      .catch((error) => {
        console.error(t("home.backendError"), error);
        setBackendMessage(t("home.backendError"));
      });
  }, []);

  return (
    <div className="home">
      <Navbar passPopupHandlers={setPopupHandlers} />
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="title">{t("home.title")}</h1>
            <p className="text">{t("home.subtitle")}</p>
            <div className="btn-container">
              <button
                className="button"
                onClick={() => popupHandlers?.openRegisterPopup()}
              >
                {t("home.cta")}
              </button>
            </div>
          </div>
          <img src="/image1.png" alt="Foto Finder" className="hero-image" />
        </div>

        <h2 className="features-title">{t("home.featuresTitle")}</h2>
        <div className="features-section">
          <div className="feature">
            <img src="/image2.png" alt="-" className="feature-image" />
            <h3 className="feature-title">{t("home.feature1Title")}</h3>
            <p className="feature-text">{t("home.feature1Text")}</p>
          </div>

          <div className="feature">
            <img src="/image3.png" alt="-" className="feature-image" />
            <h3 className="feature-title">{t("home.feature2Title")}</h3>
            <p className="feature-text">{t("home.feature2Text")}</p>
          </div>

          <div className="feature">
            <img src="/image4.png" alt="-" className="feature-image" />
            <h3 className="feature-title">{t("home.feature3Title")}</h3>
            <p className="feature-text">{t("home.feature3Text")}</p>
          </div>
        </div>

        <div className="steps-section">
          <h2 className="steps-title">{t("home.stepsTitle")}</h2>
          <div className="steps-container">
            <div className="step">
              <FaRegUser className="step-icon" />
              <h3 className="step-title">{t("home.step1")}</h3>
              <p className="step-text">{t("home.step1Text")}</p>
            </div>

            <div className="step-divider vertical"></div>

            <div className="step">
              <MdOutlineAddAPhoto className="step-icon" />
              <h3 className="step-title">{t("home.step2")}</h3>
              <p className="step-text">{t("home.step2Text")}</p>
            </div>

            <div className="step-divider vertical"></div>

            <div className="step">
              <BiStats className="step-icon" />
              <h3 className="step-title">{t("home.step3")}</h3>
              <p className="step-text">{t("home.step3Text")}</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h1 className="cta-title">{t("home.ctaTitle")}</h1>
          <div className="cta-content">
            <p className="cta-text">{t("home.ctaText")}</p>
            <button
              className="button cta-button"
              onClick={() => popupHandlers?.openRegisterPopup()}
            >
              {t("home.ctaButton")}
            </button>
          </div>
        </div>

        <div className="backend-message">Backend : {backendMessage}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
