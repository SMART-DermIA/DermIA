import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./login.css";
import {useAuth} from "../auth/authContext.jsx";

export default function Login({ closePopup, openRegisterPopup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      login(username, password);
      toast.success(t("login.success"));
      setSuccess(t("login.success"));
      closePopup();
      navigate("/userAccueil");

    } catch (err) {
      console.error(t("login.networkError"), err);
      setError(t("login.networkError"));
      toast.error(t("login.networkError"));
    }
  };

  const handleRegisterLinkClick = () => {
    closePopup();
    openRegisterPopup();
  };

  return (
    <div className="login-popup-container" onClick={closePopup}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <img src="/logo.png" alt="Logo" className="login-logo" />

        <h1>{t("login.welcome")}</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">{t("login.email")}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{t("login.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="submit-button">
            {t("login.submit")}
          </button>
        </form>

        <p className="terms">{t("login.terms")}</p>

        <p className="register-link">
          {t("login.noAccount")}{" "}
          <span className="link" onClick={handleRegisterLinkClick}>
            {t("login.register")}
          </span>
        </p>
      </div>
    </div>
  );
}