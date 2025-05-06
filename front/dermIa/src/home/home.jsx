import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">Détectez la dangerosité de vos grains de beauté en un clin d’œil.</h1>
      <p className="text">Notre IA générative analyse vos grains de beauté pour garantir votre sécurité et votre santé.</p>
      <button className="button">Commencer</button>
      <h2 className="features-title">Découvrez nos fonctionnalités innovantes pour la santé de votre peau.</h2>
      <div className="features-section">
          
          <div className="feature">
            <h3 className="feature-title">Suivez l'évolution de vos grains de beauté facilement et efficacement.</h3>
            <p className="feature-text">Notre IA détecte la dangerosité de vos grains de beauté en un clin d'œil.</p>
          </div>

          <div className="feature">
            <h3 className="feature-title">Gérez vos grains de beauté avec notre interface intuitive et simple.</h3>
            <p className="feature-text">Créez des albums pour suivre l'évolution de chaque grain de beauté.</p>
          </div>

          <div className="feature">
            <h3 className="feature-title">Utilisez la fonction drag & drop pour une expérience utilisateur fluide.</h3>
            <p className="feature-text">Déplacez vos images de grains de beauté facilement pour une analyse rapide.</p>
          </div>
        </div>
        <div className="section-placeholder">
          <button className="add-section">+ Section</button>
        </div>
    </div>
  );
};

export default Home;