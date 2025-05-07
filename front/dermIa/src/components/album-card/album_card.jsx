import React from 'react';
import './album_card.css';

function AlbumCard({ imageUrl, title, lastModified }) {
  return (
    <div className="album-card">
      <img src={imageUrl} alt={title} className="album-image" />
      <div className="album-info">
        <p className="album-title">{title}</p>
        <p className="album-date">Dernière modification: {lastModified}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
