import React from "react";
import "./picture_card.css";
import { FaRegTrashAlt } from "react-icons/fa";

function PictureCard({ image, date, dangerosite}) {
	return (
		<div className="card">
			<div className="photo-header">
				<FaRegTrashAlt className="delete-icon" />
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