import React from "react";
import Navbar from "../components/navBar/navbar";
import ImageUpload from "../components/imgUpload/imgUpload";
import "./userAccueil.css";
import { useAuth } from "../auth/authContext.jsx";
import { useTranslation } from "react-i18next";

const UserAccueil = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
      {user && (
        <h1 className="titre-bienvenue">
          {t("userAccueil.welcome")} {user.username} !{" "}
        </h1>
      )}
      <ImageUpload />
    </div>
  );
};

export default UserAccueil;
