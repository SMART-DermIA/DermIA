import React from "react";
import "./picture_card.css";
import { FaRegTrashAlt } from "react-icons/fa";

function PictureCard({ image, date, dangerosite, onClick }) {
	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this picture?")) {
			console.log("Delete picture");
		}
	};

	return (
		<div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
			<div className="photo-header">
				<FaRegTrashAlt className="delete-icon" onClick={handleDelete} />
			</div>
			<img src={image} alt="Image" className="photo" />
			<div className="photo-body">
				<p className="photo-date mb-0">{date}</p>
				<span className={`dot ${dangerosite}`}></span>
			</div>
		</div>
	);
}

export default PictureCard;