import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import "./BodyMap.css";

import bodyFrontBack from "../../assets/corps.svg";
import bodyLeft from "../../assets/corps_gauche.svg";
import bodyRight from "../../assets/corps_droit.svg";

const BodyMap = ({ albums }) => {
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
          Vue avant
        </button>
        <button
          onClick={() => setSelectedOrientation("back")}
          className={selectedOrientation === "back" ? "active" : ""}
        >
          Vue arrière
        </button>
        <button
          onClick={() => setSelectedOrientation("left")}
          className={selectedOrientation === "left" ? "active" : ""}
        >
          Côté gauche
        </button>
        <button
          onClick={() => setSelectedOrientation("right")}
          className={selectedOrientation === "right" ? "active" : ""}
        >
          Côté droit
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
          <div className="bodymap-image-wrapper">
            <img src={getBodyImage()} alt="Silhouette du corps" className="bodymap-image" />
            {visibleAlbums.map((album, i) => (
              <div
                key={i}
                className="bodymap-point"
                style={{
                  left: `${parseFloat(album.position_x) * 100}%`,
                  top: `${parseFloat(album.position_y) * 100}%`,
                }}
                onClick={() => handleClick(album.id)}
                title={album.title}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default BodyMap;