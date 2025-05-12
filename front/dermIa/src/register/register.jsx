import React, { useState } from "react";
import "./register.css";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Register({ closePopup, openLoginPopup }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    identifier: "",
    age: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        alert(data.error || t("register.error"));
      }
    } catch (err) {
      alert(t("register.networkError"));
    }
  };

  return (
    <div className="register-popup-container" onClick={closePopup}>
      <div className="register-card" onClick={(e) => e.stopPropagation()}>
        <img src="../public/logo.png" alt="App Logo" className="register-logo" />
        
        <h1>{t("register.welcome")}</h1>
        <p>{t("register.subtitle")}</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("register.identifier")}</label>
            <input
              type="text"
              name="identifier"
              placeholder={t("register.identifierPlaceholder")}
              value={formData.identifier}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label>{t("register.age")}</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              placeholder={t("register.agePlaceholder")}
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>{t("register.password")}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("register.passwordPlaceholder")}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t("register.hidePassword") : t("register.showPassword")}
              >
                {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button">
            {t("register.submit")}
          </button>
        </form>

        <p className="terms">
          {t("register.terms")}
        </p>

        <p className="login-link">
          {t("register.alreadyMember")}{" "}
          <span className="link" onClick={openLoginPopup}>
            {t("register.login")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;