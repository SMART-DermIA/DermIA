import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from '../components/navBar/navbar';
import Footer from '../components/footer/footer';
import Register from '../register/register';

import { FaRegUser } from "react-icons/fa";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { BiStats } from "react-icons/bi";

const Home = () => {
    const [backendMessage, setBackendMessage] = useState('Chargement...');
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

    useEffect(() => {
        fetch(`${API_BASE_URL}/`)
        .then(response => response.json())
        .then(data => setBackendMessage(data.message))
        .catch(error => {
            console.error('Erreur lors de la connexion au backend:', error);
            setBackendMessage('Erreur de connexion au backend');
        });
    }, []);

    const openRegisterPopup = () => {
        setShowRegisterPopup(true);
    };

    const closeRegisterPopup = () => {
        setShowRegisterPopup(false);
    };

    return (
        <div className="home">
            <Navbar className="navbar" />
            <div className="container">
                <h1 className="title">Détectez la dangerosité de vos grains de beauté en un clin d’œil.</h1>
                <p className="text">Notre IA générative analyse vos grains de beauté pour garantir votre sécurité et votre santé.</p>
                <div className="btn-container">
                    <button className="button" onClick={openRegisterPopup}>S’inscrire et commencer</button>
                </div>
                <img src="/image1.png" alt="Foto Finder" className='image' />
                <h2 className="features-title">Découvrez nos fonctionnalités innovantes pour la santé de votre peau.</h2>
                <div className="features-section">
                    <div className="feature">
                        <img src="/image2.png" alt="-" className='image' />
                        <h3 className="feature-title">Suivez l'évolution de vos grains de beauté facilement et efficacement.</h3>
                        <p className="feature-text">Notre IA détecte la dangerosité de vos grains de beauté en un clin d'œil.</p>
                    </div>

                    <div className="feature">
                        <img src="/image3.png" alt="-" className='image' />
                        <h3 className="feature-title">Gérez vos grains de beauté avec notre interface intuitive et simple.</h3>
                        <p className="feature-text">Créez des albums pour suivre l'évolution de chaque grain de beauté.</p>
                    </div>

                    <div className="feature">
                        <img src="/image4.png" alt="-" className='image' />
                        <h3 className="feature-title">Utilisez la fonction drag & drop pour une expérience utilisateur fluide.</h3>
                        <p className="feature-text">Déplacez vos images de grains de beauté facilement pour une analyse rapide.</p>
                    </div>
                </div>
                <div className="steps-section">
                    <h2 className="steps-features-title">Découvrez comment utiliser notre service</h2>
                    <div className="step">
                        <FaRegUser size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">Étape 1 : Créez votre compte</h3>
                        <p className="step-text">Inscrivez-vous en quelques clics pour commencer.</p>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <MdOutlineAddAPhoto size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">Étape 2 : Téléchargez vos photos</h3>
                        <p className="step-text">Glissez-déposez vos images de grains de beauté pour analyse.</p>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <BiStats size={32} style={{ margin: '.5em' }} />
                        <h3 className="step-title">Étape 3 : Suivez l'évolution</h3>
                        <p className="step-text">Organisez vos photos dans des albums pour un suivi facile.</p>
                    </div>
                </div>

                <div className="cta-section">
                    <h1 className="title-final">Créez votre compte gratuitement</h1>
                    <div className="cta-divider">
                        <p className="cta-text">Rejoignez notre communauté et commencez à surveiller la santé de vos grains de beauté. Essayez notre service innovant sans frais dès aujourd'hui !</p>
                        <button className="button" onClick={openRegisterPopup}>Inscription</button>
                    </div>
                </div>

                <div style={{ marginTop: "2em", textAlign: "center", fontSize: "0.9em", color: "gray" }}>
                    Backend : {backendMessage}
                </div>
            </div>
            <Footer />

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
        </div>
    );
};

export default Home;