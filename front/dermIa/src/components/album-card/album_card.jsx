import React from 'react';
import './album_card.css';
import { useNavigate } from 'react-router-dom';

function AlbumCard({ id, imageUrl, title, lastModified }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/historique/${id}`);
  }
  return (
    <div className="album-card" onClick={handleClick} style={{cursor: 'pointer'}}>
      <img src={imageUrl} alt={title} className="album-image" />
      <div className="album-info">
        <p className="album-title">{title}</p>
        <p className="album-date">Dernière modification: {lastModified}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
