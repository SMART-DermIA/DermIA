import React, { useState } from "react";
import Navbar from "../components/navBar/navbar";
import "./register.css"; // Asegúrate de crear un archivo CSS para los estilos.
import { MdOutlineVisibilityOff } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";

function Register() {
  const [formData, setFormData] = useState({
    identifier: "",
    age: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    
  };

  return (
    <>
        <div className="register-card">
          <img
            src="../public/logo.png"
            alt="DermIA Logo"
            className="register-logo"
          />
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
                type={showPassword ? "text" : "password"} // Cambia el tipo de input
                id="password"
                name="password"
                placeholder="Créer un mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {showPassword ? (
                <MdOutlineVisibilityOff
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <MdOutlineVisibility
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                />
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
    </>
  );
}

export default Register;