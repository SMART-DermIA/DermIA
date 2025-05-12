import React, { useState, useEffect } from "react";
import Navbar from "../components/navBar/navbar";
import AlbumCard from "../components/album-card/album_card";
import BodyMap from "../components/BodyMap/BodyMap";
import { Link } from "react-router-dom";
import { LuScanSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthContext";
import "./historique.css";

const Historique = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");

  const [albums, setAlbums] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" ou "map"

  // Charger les albums de l'utilisateur
  useEffect(() => {
    const fetchAlbums = async () => {
      const token = localStorage.getItem("token");
      try {
        const resp = await fetch(`${API_BASE_URL}/user/albums`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          setAlbums(data);
        }
      } catch (err) {
        console.error("Erreur chargement des albums :", err);
      }
    };
    if (user) fetchAlbums();
  }, [API_BASE_URL, user]);

  return (
    <div>
      <Navbar />
      <div className="historique-container">
        <div className="historique-header">
          <div className="historique-header-text">
            <h1 className="historique-title">{t("historique.title")}</h1>
            <p className="historique-subtitle">{t("historique.subtitle")}</p>
          </div>
          <div className="historique-header-button">
            <Link to="/userAccueil" className="nouvelle-button">
              <LuScanSearch
                size={20}
                style={{ marginBottom: ".2em", marginRight: ".5em" }}
              />
              {t("historique.newAnalysis")}
            </Link>
          </div>
        </div>

        {/* Toggle Vue Liste / Carte */}
        <div className="historique-toggle">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            {t("historique.viewList")}
          </button>
          <button
            className={viewMode === "map" ? "active" : ""}
            onClick={() => setViewMode("map")}
          >
            {t("historique.viewMap")}
          </button>
        </div>

        {viewMode === "map" ? (
          <BodyMap
            albums={albums.map((a) => ({
              id: a.id,
              title: a.title,
              x: a.x,
              y: a.y,
              view: a.view,
              date: a.date,
            }))}
            onCreateAlbum={null} // lecture seule
          />
        ) : (
          <div className="historique-albums">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                imageUrl={album.coverUrl || "/placeholder.png"}
                title={album.title}
                lastModified={new Date(album.date).toLocaleDateString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;
