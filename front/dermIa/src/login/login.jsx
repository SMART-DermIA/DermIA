import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; 

function Login({ closePopup, setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,   // envoie l'email comme username pour l'instant
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Token reçu :", data.access_token);
                setSuccess("Connexion réussie !");
                // Option bonus : sauvegarder le token pour la session
                localStorage.setItem("token", data.access_token);
                setIsAuthenticated(true);
                closePopup();

                navigate("/userAccueil");
            } else {
                setError(data.error || "Erreur de connexion.");
            }
        } catch (err) {
            console.error("Erreur réseau ou serveur :", err);
            setError("Erreur réseau ou serveur.");
        }
    };


  return (
      <div className="login-card">
        <img src="/logo.png" alt="Logo" className="login-logo" />
        <h1>Bienvenue sur DERM'IA !</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Identifiant"
              required
            />
          </div>
          <div className="form-group ">
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