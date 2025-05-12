import React, { useState } from "react";
import "./register.css";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function Register({ closePopup, openLoginPopup }) {
  const { t } = useTranslation();
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
        alert(data.error || t("register.error"));
      }
    } catch (err) {
      alert(t("register.networkError"));
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
      <h1>{t("register.welcome")}</h1>
      <p>{t("register.subtitle")}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="identifier">{t("register.identifier")}</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          placeholder={t("register.identifierPlaceholder")}
          value={formData.identifier}
          onChange={handleChange}
          required
        />

        <label htmlFor="age">{t("register.age")}</label>
        <input
          type="number"
          id="age"
          name="age"
          placeholder={t("register.agePlaceholder")}
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">{t("register.password")}</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder={t("register.passwordPlaceholder")}
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
          {t("register.submit")}
        </button>
      </form>
      <p className="terms">{t("register.terms")}</p>
      <p className="login-link">
        {t("register.alreadyMember")}{" "}
        <span className="link" onClick={handleLoginLinkClick}>
          {t("register.login")}
        </span>
      </p>
    </div>
  );
}

export default Register;
