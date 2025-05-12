import React from 'react';
import { useTranslation } from 'react-i18next';
import './album_card.css';
import { useNavigate } from 'react-router-dom';


function AlbumCard({ id, imageUrl, title, lastModified }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = () => {
    navigate(`/historique/${id}`);
  }
  return (
    <div className="album-card" onClick={handleClick} style={{cursor: 'pointer'}}>
      <img src={imageUrl} alt={title} className="album-image" />
      <div className="album-info">
        <p className="album-title">{title}</p>
        <p className="album-date">{t('album.lastModified')}: {lastModified}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
