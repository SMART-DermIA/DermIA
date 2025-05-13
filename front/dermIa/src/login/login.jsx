import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./login.css";
import { useAuth } from "../auth/authContext.jsx";

export default function Login({ closePopup, openRegisterPopup }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    // 2) Si échec pure et simple
    if (!result.ok) {
      toast.error(result.error || t("login.error"));
      return;
    }

    // 3) Si on doit passer par l’Email-2FA
    if (result["2fa_email_required"]) {
      setTempToken(result.temp_token);
      setStage("email2fa");
      return;
    }

    // 4) Si on doit passer par le TOTP-2FA
    if (result["2fa_required"]) {
      setTempToken(result.temp_token);
      setStage("totp2fa");
      return;
    }

    // 5) Sinon, connexion classique : on récupère le access_token
    //    et l’utilisateur (s’il est renvoyé par ton contexte)
    localStorage.setItem("token", result.access_token);
    if (result.user) {
      setUser(result.user);
    }
    toast.success(t("login.success"));
    closePopup();
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
            <label htmlFor="email">{t("login.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              autoComplete="email"
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
