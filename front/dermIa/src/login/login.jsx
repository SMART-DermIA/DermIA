import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import "./login.css";

export default function Login({ closePopup, openRegisterPopup }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("login response payload:", data);

      if (response.ok) {
        if (data.access_token && data.user) {
          login(data.user, data.access_token);
          toast.success("Connexion réussie !");
          closePopup();
          navigate("/userAccueil");
        } else {
          console.error("Login: payload incomplet", data);
          toast.error("Réponse inattendue du serveur.");
        }
      } else {
        toast.error(data.error || "Erreur de connexion.");
      }
    } catch (err) {
      console.error("Erreur réseau ou serveur :", err);
      toast.error("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="login-card">
      <img src="/logo.png" alt="Logo" className="login-logo" />
      <h1>Bienvenue sur DERM'IA !</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Identifiant</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Identifiant"
            required
          />
        </div>
        <div className="form-group">
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
        En poursuivant, vous acceptez les conditions d’utilisation de DERM’IA…
      </p>
      <p className="register-link">
        Vous n’êtes pas encore sur DERM’IA ?{" "}
        <span className="link" onClick={openRegisterPopup}>
          Inscrivez-vous
        </span>
      </p>
    </div>
  );
}
