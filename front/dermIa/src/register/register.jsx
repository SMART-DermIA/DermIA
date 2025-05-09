import React, { useState } from "react";
import "./register.css";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";

function Register({ closePopup, openLoginPopup }) {
  const [formData, setFormData] = useState({
    identifier: "",
    age: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.identifier,
          password: formData.password,
          age: formData.age,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        closePopup(); 
        openLoginPopup(); 
      } else {
        alert(data.error || "Erreur d'inscription");
      }
    } catch (err) {
      alert("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="register-card">
      <img src="../public/logo.png" alt="DermIA Logo" className="register-logo" />
      <h1>Bienvenue sur DERM’IA !</h1>
      <p>Détectez la dangerosité de vos grains de beauté en un clin d'œil.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="identifier">Identifiant</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          placeholder="Identifiant"
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Créer un mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {showPassword ? (
            <MdOutlineVisibilityOff className="toggle-password" onClick={togglePasswordVisibility} />
          ) : (
            <MdOutlineVisibility className="toggle-password" onClick={togglePasswordVisibility} />
          )}
        </div>

        <button type="submit" className="submit-button">
          Continuer
        </button>
      </form>
      <p className="terms">
        En poursuivant, vous acceptez les conditions d'utilisation de DERM’IA et reconnaissez avoir lu notre politique de confidentialité.
      </p>
      <p className="login-link">
        Déjà membre ? <a href="/login">Se connecter</a>
      </p>
    </div>
  );
}

export default Register;