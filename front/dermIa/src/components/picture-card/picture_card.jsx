import React from "react";
import "./picture_card.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function PictureCard({ image, date, dangerosite, analysisId, onDelete }) {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (window.confirm(t("pictureCard.confirmDelete"))) {
      console.log("Delete picture");
    }
  };
  return (
    <div className="card">
      <div className="photo-header">
        <FaRegTrashAlt
          className="delete-icon"
          onClick={() => onDelete(analysisId)}
        />
      </div>
      <img src={image} alt="Image" className="photo" />
      <div className="photo-body">
        <p className="photo-date mb-0">{date}</p>
        <span className={`dot level-${dangerosite}`}> </span>
      </div>
    </div>
  );
}

export default PictureCard;
