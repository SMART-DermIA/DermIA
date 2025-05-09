import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from '../components/navBar/navbar';
import Footer from '../components/footer/footer';
import Register from '../register/register';

import { FaRegUser } from "react-icons/fa";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { BiStats } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();
    const [backendMessage, setBackendMessage] = useState(t("home.loading"));
    const [popupHandlers, setPopupHandlers] = useState(null); 
    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

    useEffect(() => {
        fetch(`${API_BASE_URL}/`)
        .then(response => response.json())
        .then(data => setBackendMessage(data.message))
        .catch(error => {
            console.error(t("home.backendError"), error);
            setBackendMessage(t("home.backendError"));
        });
    }, []);

    return (
        <div className="home">
            <Navbar passPopupHandlers={setPopupHandlers} />
            <div className="container">
                <h1 className="title">{t("home.title")}</h1>
                <p className="text">{t("home.subtitle")}</p>
                <div className="btn-container">
                    <button className="button" onClick={() => popupHandlers?.openRegisterPopup()}>{t("home.cta")}</button>
                </div>
                <img src="/image1.png" alt="Foto Finder" className='image' />
                <h2 className="features-title">{t("home.featuresTitle")}</h2>
                <div className="features-section">
                    <div className="feature">
                        <img src="/image2.png" alt="-" className='image' />
                        <h3 className="feature-title">{t("home.feature1Title")}</h3>
                        <p className="feature-text">{t("home.feature1Text")}</p>
                    </div>

                    <div className="feature">
                        <img src="/image3.png" alt="-" className='image' />
                        <h3 className="feature-title">{t("home.feature2Title")}</h3>
                        <p className="feature-text">{t("home.feature2Text")}</p>
                    </div>

                    <div className="feature">
                        <img src="/image4.png" alt="-" className='image' />
                        <h3 className="feature-title">{t("home.feature3Title")}</h3>
                        <p className="feature-text">{t("home.feature3Text")}</p>
                    </div>
                </div>
                <div className="steps-section">
                    <h2 className="steps-features-title">{t("home.stepsTitle")}</h2>
                    <div className="step">
                        <FaRegUser size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">{t("home.step1")}</h3>
                        <p className="step-text">{t("home.step1Text")}</p>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <MdOutlineAddAPhoto size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">{t("home.step2")}</h3>
                        <p className="step-text">{t("home.step2Text")}</p>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <BiStats size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">{t("home.step3")}</h3>
                        <p className="step-text">{t("home.step3Text")}</p>
                    </div>
                </div>

                <div className="cta-section">
                    <h1 className="title-final">{t("home.ctaTitle")}</h1>
                    <div className="cta-divider">
                        <p className="cta-text">{t("home.ctaText")}</p>
                        <button className="button" onClick={() => popupHandlers?.openRegisterPopup()}>{t("home.ctaButton")}</button>
                    </div>
                </div>

                <div style={{ marginTop: "2em", textAlign: "center", fontSize: "0.9em", color: "gray" }}>
                    Backend : {backendMessage}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;