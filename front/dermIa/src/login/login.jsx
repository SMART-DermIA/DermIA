import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 

function Login({ closePopup, setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    setIsAuthenticated(true);
    closePopup();

    navigate("/userAccueil");
  };

  return (
      <div className="login-card">
        <img src="/logo.png" alt="Logo" className="login-logo" />
        <h1>Bienvenue sur DERM'IA !</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Identifiant"
              required
            />
          </div>
          <div className="form-group password-input-container">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Se connecter
          </button>
        </form>
        <p className="terms">
        En poursuivant, vous acceptez les conditions d’utilisation de DERM’IA et reconnaissez avoir lu notre politique de confidentialité. 
        </p>
        <p className="register-link">
        Vous n’êtes pas encore sur DERM’IA ? Inscrivez-vous
          </p>
      </div>
  );
}

export default Login;