import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./login.css";
import {useAuth} from "../auth/authContext.jsx";

export default function Login({ closePopup, openRegisterPopup }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username, password);

    if (result.success) {
      toast.success("Connexion réussie !");
      closePopup();
    } else {
      toast.error(result.message || "Échec de la connexion.");
      console.error(`Login failed: ${result.message} (Status ${result.status})`);
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