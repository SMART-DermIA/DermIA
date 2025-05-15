import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import "./BodyMap.css";

import bodyFrontBack from "../../assets/corps.svg";
import bodyLeft from "../../assets/corps_gauche.svg";
import bodyRight from "../../assets/corps_droit.svg";

import { useTranslation } from "react-i18next";

const BodyMap = ({ albums = [], onPositionSelect, selectedPosition  }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedOrientation, setSelectedOrientation] = useState("front");

  const handleClick = (albumId) => {
    navigate(`/historique/${albumId}`);
  };

  const visibleAlbums = albums.filter(
    (a) =>
      a.orientation === selectedOrientation &&
      !isNaN(parseFloat(a.position_x)) &&
      !isNaN(parseFloat(a.position_y))
  );

  // Détermine quelle image utiliser selon la vue
  const getBodyImage = () => {
    switch (selectedOrientation) {
      case "front":
      case "back":
        return bodyFrontBack;
      case "left":
        return bodyLeft;
      case "right":
        return bodyRight;
      default:
        return bodyFrontBack;
    }
  };

  return (
    <div className="bodymap-container">
      {/* Boutons de vue */}
      <div className="orientation-switch">
        <button
          onClick={() => setSelectedOrientation("front")}
          className={selectedOrientation === "front" ? "active" : ""}
        >
          {t('album.personBody.viewArriere')}
        </button>
        <button
          onClick={() => setSelectedOrientation("back")}
          className={selectedOrientation === "back" ? "active" : ""}
        >
          {t('album.personBody.viewAvant')}
        </button>
        <button
          onClick={() => setSelectedOrientation("left")}
          className={selectedOrientation === "left" ? "active" : ""}
        >
          {t('album.personBody.viewGauche')}
        </button>
        <button
          onClick={() => setSelectedOrientation("right")}
          className={selectedOrientation === "right" ? "active" : ""}
        >
          {t('album.personBody.viewDroite')}
        </button>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        wheel={{ wheelEnabled: true }}
        wheelZoomSpeed={3.0}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <div
            className="bodymap-image-wrapper"
            onClick={(e) => {
              // Si aucun callback n'est fourni, on ne fait rien
              if (!onPositionSelect) return;

              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = (e.clientX - rect.left) / rect.width;
              const clickY = (e.clientY - rect.top) / rect.height;

              console.log("Clique enregistré :", clickX, clickY, selectedOrientation);

              onPositionSelect({
                x: clickX,
                y: clickY,
                orientation: selectedOrientation
              });
            }}
          >
            <img src={getBodyImage()} alt="Silhouette du corps" className="bodymap-image" />
            {visibleAlbums.map((album, i) => (
              <div
                key={i}
                className="bodymap-point"
                style={{
                  left: `${parseFloat(album.position_x) * 100}%`,
                  top: `${parseFloat(album.position_y) * 100}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation(); // 🔐 Pour éviter que le clic sur un point ne déclenche la sélection
                  handleClick(album.id);
                }}
                title={album.title}
              />
            ))}
            {selectedPosition && (
              <div
                className="bodymap-point temporary"
                style={{
                  left: `${selectedPosition.x * 100}%`,
                  top: `${selectedPosition.y * 100}%`,
                }}
                title="Nouvelle position"
              />
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default BodyMap;