import React from 'react';
import { useTranslation } from 'react-i18next';
import './album_card.css';

function AlbumCard({ imageUrl, title, lastModified }) {
  const { t } = useTranslation();

  return (
    <div className="album-card">
      <img src={imageUrl} alt={title} className="album-image" />
      <div className="album-info">
        <p className="album-title">{title}</p>
        <p className="album-date">{t('album.lastModified')}: {lastModified}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
