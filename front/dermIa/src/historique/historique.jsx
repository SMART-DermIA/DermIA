import React, { useEffect, useReducer, useState } from "react";
import Navbar from "../components/navBar/navbar";
import AlbumCard from "../components/album-card/album_card";
import { useTranslation } from "react-i18next";
import "./historique.css";
import { getUsersAlbums } from "../services/AlbumService.js";
import { createAsyncReducer } from "../reducers/asyncReducer.js";
import BodyMap from "../components/body-map/BodyMap";

const { asyncReducer: albumsReducer, initialState } = createAsyncReducer([]);

const Historique = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(albumsReducer, initialState);
  const [showBodyMap, setShowBodyMap] = useState(false); // 👈 toggle

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    getUsersAlbums()
      .then((albums) => dispatch({ type: "FETCH_SUCCESS", payload: albums }))
      .catch((err) => {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Could not load recent posts.",
        });
        console.error(err);
      });
  }, []);

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
            <button
              onClick={() => setShowBodyMap(!showBodyMap)}
              className={`toggle-view-button ${showBodyMap ? "active" : ""}`}
            >
              {showBodyMap
                ? t("album.buttonFolders")
                : t("album.buttonBody")}
            </button>
          </div>
        </div>

        {state.error ? (
          <div className="historique-albums">
            <p>{state.error}</p>
          </div>
        ) : state.loading ? (
          <div className="historique-albums">
            <p>Chargement...</p>
          </div>
        ) : showBodyMap ? (
          <BodyMap albums={state.data} />
        ) : (
          <div className="historique-albums">
            {state.data.map((album, i) => (
              <AlbumCard
                key={i}
                id={album.id}
                imageUrl={album.last_photo}
                title={album.title}
                lastModified={album.last_updated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;
