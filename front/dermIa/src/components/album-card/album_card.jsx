import React from 'react';
import { useTranslation } from 'react-i18next';
import './album_card.css';
import { useNavigate } from 'react-router-dom';


function AlbumCard({ id, imageUrl, title, lastModified }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = () => {
    navigate(`/historique/${id}`);
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
        <p className="album-date">{t('album.lastModified')}: {new Date(lastModified).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
