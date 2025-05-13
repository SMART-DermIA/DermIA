import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import "./BodyMap.css";
import bodyImage from "../../assets/corps.svg"; // même image pour face/dos

const BodyMap = ({ albums }) => {
  const navigate = useNavigate();
  const [selectedOrientation, setSelectedOrientation] = useState("front");

  const handleClick = (albumId) => {
    navigate(`/historique/${albumId}`);
  };

  // Albums correspondant à la vue sélectionnée
  const visibleAlbums = albums.filter(
    (a) =>
      a.orientation === selectedOrientation &&
      !isNaN(parseFloat(a.position_x)) &&
      !isNaN(parseFloat(a.position_y))
  );

  return (
    <div className="bodymap-container">
      {/* Boutons de bascule avant / arrière */}
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
            <img src={bodyImage} alt="Corps humain" className="bodymap-image" />
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