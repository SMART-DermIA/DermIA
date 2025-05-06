import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">Détectez la dangerosité de vos grains de beauté en un clin d’œil.</h1>
      <p className="text">Notre IA générative analyse vos grains de beauté pour garantir votre sécurité et votre santé.</p>
      <div className="btn-container">
      <button className="button">Commencer</button>
      </div>
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
        
        <div className="steps-section">
        <h2 className="steps-features-title">Découvrez comment utiliser notre service</h2>
        <p className="steps-intro">Commencez par créer un compte pour accéder à toutes nos fonctionnalités. Une fois connecté, vous pourrez détecter la dangerosité de vos grains de beauté et suivre leur évolution.</p>

        <div className="step">
          <h3 className="step-title">Étape 1 : Créez votre compte</h3>
          <p className="step-text">Inscrivez-vous en quelques clics pour commencer.</p>
        </div>

        <div className="step-divider"></div>

        <div className="step">
          <h3 className="step-title">Étape 2 : Téléchargez vos photos</h3>
          <p className="step-text">Glissez-déposez vos images de grains de beauté pour analyse.</p>
        </div>

        <div className="step-divider"></div>

        <div className="step">
          <h3 className="step-title">Étape 3 : Suivez l'évolution</h3>
          <p className="step-text">Organisez vos photos dans des albums pour un suivi facile.</p>
        </div>
      </div>
      <div className="step-actions">
            <button className="step-button unchecked">Commencer</button>
            <button className="step-button checked">Se connecter</button>
          </div>

      <div className="cta-section">
        <h1 className="title">Créez votre compte gratuitement</h1>
        <p className="text">Rejoignez notre communauté et commencez à surveiller la santé de vos grains de beauté. Essayez notre service innovant sans frais dès aujourd’hui !</p>
        <button className="button">Inscription</button>
      </div>
    </div>
  );
};

export default Home;