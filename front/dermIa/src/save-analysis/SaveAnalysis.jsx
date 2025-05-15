import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SaveAnalysis.css";
import { useNavigate } from "react-router-dom";
import { createAlbum, getUsersAlbums } from "../services/AlbumService.js";
import { createAsyncReducer } from "../reducers/asyncReducer.js";
import { toast } from "react-toastify";
import Navbar from "../components/navBar/navbar.jsx";
import AlbumCard from "./album-card/album_card.jsx";
import BodyMap from "../components/body-map/BodyMap.jsx";

const { asyncReducer: albumsReducer, initialState } = createAsyncReducer([]);

export default function SaveAnalysis() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [state, dispatch] = useReducer(albumsReducer, initialState);

  const [albumTitle, setAlbumTitle] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar el popup
  const [position, setPosition] = useState(null); // { x, y, orientation }

  useEffect(() => {
    const analysis_string = localStorage.getItem("analysis");

    if (analysis_string) {
      const retrieved_analysis = JSON.parse(analysis_string);
      setAnalysis(retrieved_analysis);
    }

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

  const handleCreateAlbum = async () => {
    if (!albumTitle || !analysis.image) {
      toast.error(t("createAlbum.missingFields"));
      return;
    }

    if (!position) {
      alert(t("addToAlbum.selectPositionRequired"));
      return;
    }

    console.log("Creating album with title:", analysis);
    const formData = new FormData();

    formData.append("position_x", position.x);
    formData.append("position_y", position.y);
    formData.append("orientation", position.orientation);
    formData.append("title", albumTitle);
    formData.append("result", analysis.result);
    formData.append("danger_rate", analysis.danger_rate);
    formData.append("confidence", analysis.confidence);
    formData.append("asymmetry", analysis.scores.asymmetry);
    formData.append("color", analysis.scores.color);
    formData.append("irregularity", analysis.scores.irregularity);
    formData.append("size", analysis.scores.size);

    const base64Data = analysis.image.split(",")[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      arrayBuffer[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
    const fileName = analysis.fileName || "uploaded_image.jpg";
    const file = new File([blob], fileName, { type: "image/jpeg" });

    formData.append("image", file);

    try {
      const response = await createAlbum(formData);
      if (response.success) {
        toast.success(t("addToAlbum.success"));
        navigate(`/historique/${response.analysis.album_id}`);
        localStorage.removeItem("analysis");
      } else {
        toast.error(t("addToAlbum.error"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("addToAlbum.error"));
    }
  };

  if (!analysis) return <div>{t("addToAlbum.waiting")}</div>;

  return (
    <div>
      <Navbar />
      <div className="albums-container">
        <div className="albums-header">
          <div className="albums-header-text">
            <h1 className="albums-title">Vos albums</h1>
          </div>
          <div className="albums-header-button">
            <button
              className="nouvelle-button"
              onClick={() => setIsPopupOpen(true)}
            >
              {t("addToAlbum.createAlbum")}
            </button>
          </div>
        </div>

        {state.error ? (
          <div className="albums-albums">
            <p>{state.error}</p>
          </div>
        ) : state.loading ? (
          <div className="albums-albums">
            <p>{t("addToAlbum.loading")}</p>
          </div>
        ) : (
          <div className="albums-albums">
            {state.data.map((album, i) => (
              <AlbumCard
                key={i}
                id={album.id}
                imageUrl={album.last_photo}
                title={album.title}
                lastModified={album.last_updated}
                analysis={analysis}
              />
            ))}
          </div>
        )}

        {/* Popup para crear un nuevo álbum */}
        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>{t("addToAlbum.createAlbum")}</h2>

              <BodyMap
                albums={[]}
                onPositionSelect={setPosition}
                selectedPosition={position}
              />

              <p style={{ fontSize: "0.9em", marginTop: "1em" }}>
                {position
                  ? `${t("addToAlbum.positionSet")} (${Math.round(
                      position.x * 100
                    )}%, ${Math.round(position.y * 100)}%)`
                  : t("addToAlbum.clickToSetPosition")}
              </p>

              <input
                type="text"
                placeholder={t("addToAlbum.albumTitlePlaceholder")}
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="album-title-input"
              />

              <div className="popup-buttons">
                <button className="confirm-button" onClick={handleCreateAlbum}>
                  {t("addToAlbum.confirm")}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setIsPopupOpen(false)}
                >
                  {t("addToAlbum.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
