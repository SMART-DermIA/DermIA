import React, { useState } from "react";
import "./register.css";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { toast } from "react-toastify";

function Register({ closePopup, openLoginPopup }) {
  const [formData, setFormData] = useState({
    identifier: "",
    age: "",
    password: "",
    doctor_name: "",
    doctor_phone: "",
    doctor_email: "",
  });
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");

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
          doctor_name: formData.doctor_name || undefined,
          doctor_phone: formData.doctor_phone || undefined,
          doctor_email: formData.doctor_email || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Inscription réussie !");
        closePopup();
        openLoginPopup();
      } else {
        alert(data.error || "Erreur d'inscription");
      }
    } catch (err) {
      alert("Erreur réseau ou serveur");
    }
  };

  const handleLoginLinkClick = () => {
    closePopup();
    openLoginPopup();
  };

  return (
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
            type={showPassword ? "text" : "password"}
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
        {showDoctorForm && (
          <div className="doctor-form">
            <label>
              Nom du médecin
              <input
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                placeholder="Dr. Dupont"
              />
            </label>
            <label>
              Téléphone
              <input
                name="doctor_phone"
                value={formData.doctor_phone}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </label>
            <label>
              Email
              <input
                name="doctor_email"
                value={formData.doctor_email}
                onChange={handleChange}
                placeholder="medecin@exemple.com"
              />
            </label>
          </div>
        )}
        <button
          type="button"
          className="toggle-doctor-btn"
          onClick={() => setShowDoctorForm((v) => !v)}
        >
          {showDoctorForm
            ? "Masquer médecin traitant (optionnel)"
            : "Ajouter médecin traitant (optionnel)"}
        </button>

        <button type="submit" className="submit-button">
          Continuer
        </button>
      </form>
      <p className="terms">
        En poursuivant, vous acceptez les conditions d'utilisation de DERM’IA et
        reconnaissez avoir lu notre politique de confidentialité.
      </p>
      <p className="login-link">
        Déjà membre ?{" "}
        <span className="link" onClick={handleLoginLinkClick}>
          Se connecter
        </span>
      </p>
    </div>
  );
}

export default Register;
