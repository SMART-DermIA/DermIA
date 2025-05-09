import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./login.css";

function Login({ closePopup, setIsAuthenticated, openRegisterPopup }) {
  const { t } = useTranslation();
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
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(t("login.tokenReceived"), data.access_token);
        setSuccess(t("login.success"));
        localStorage.setItem("token", data.access_token);
        setIsAuthenticated(true);
        closePopup();
        navigate("/userAccueil");
      } else {
        setError(data.error || t("login.error"));
      }
    } catch (err) {
      console.error(t("login.networkError"), err);
      setError(t("login.networkError"));
    }
  };

  const handleRegisterLinkClick = () => {
    closePopup();
    openRegisterPopup();
  };

  return (
    <div className="login-card">
      <img src="/logo.png" alt="Logo" className="login-logo" />
      <h1>{t("login.welcome")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t("login.email")}</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.emailPlaceholder")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t("login.password")}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder")}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {t("login.submit")}
        </button>
      </form>
      <p className="terms">
        {t("login.terms")}
      </p>
      <p className="register-link">
        {t("login.noAccount")}{" "}
        <span className="link" onClick={handleRegisterLinkClick}>
          {t("login.register")}
        </span>
      </p>
    </div>
  );
}

export default Login;