import React from 'react';
import { useTranslation } from 'react-i18next';
import './album_card.css';
import { useNavigate } from 'react-router-dom';
import { addAnalysisToAlbum } from '../../services/AlbumService'; 

function AlbumCard({ id, imageUrl, title, lastModified, analysis }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = async () => {
    if (!analysis || !analysis.image || !title || !lastModified) {
      alert(t("addToAlbum.missingFields"));
      return;
    }

    const formData = new FormData();
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
    formData.append("result", "hoal2");
    formData.append("date", lastModified);

    try {
      const response = await addAnalysisToAlbum(id, formData); 
      if (response.success) {
        alert(t("addToAlbum.success"));
        navigate(`/historique/${id}`);
      } else {
        alert(t("addToAlbum.error"));
      }
    } catch (err) {
      console.error(err);
      alert(t("addToAlbum.error"));
    }
  };

  return (
    <div
      className="album-card"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClick();
      }}
    >
      <img src={imageUrl} alt={title} className="album-image" />
      <div className="album-info">
        <p className="album-title">{title}</p>
        <p className="album-date">{t('album.lastModified')}: {lastModified}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
