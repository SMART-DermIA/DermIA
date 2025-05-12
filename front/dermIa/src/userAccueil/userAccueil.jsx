import React from "react";
import Navbar from "../components/navBar/navbar";
import ImageUpload from "../components/imgUpload/imgUpload";
import "./userAccueil.css";
import {useAuth} from "../auth/authContext.jsx";

const UserAccueil = () => {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      {user && (
        <h1 className="titre-bienvenue">Bienvenue {user.username} ! </h1>
      )}
      <ImageUpload />
    </div>
  );
};

export default UserAccueil;
