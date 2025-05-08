import React, { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { LuBookImage } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";

import "./imgResultat.css";

export default function ImageResultat() {
	const location = useLocation();
	const navigate = useNavigate();
	const image = location.state?.image;

	useEffect(() => {
		if (!image) {
			navigate("/result");
		}
	}, [image, navigate]);
	
	return (
		<div className="resultat-container">
			<h2 className="resultat-title">Analyse terminée</h2>
			<img src={image} alt="Analyse" className="resultat-image" />
			<h5 className="resultat-subtitle">Voici les résultats de votre analyse :</h5>
			<div className="resultat-list">
				<div className="resultat-item">
					<p className="resultat-label">Irregularité : </p>
					<p className="resultat-value">100%</p>
				</div>
				<div className="resultat-item">
					<p className="resultat-label">Assymétrie : </p>
					<p className="resultat-value">100%</p>
				</div>
				<div className="resultat-item">
					<p className="resultat-label">Taille : </p>
					<p className="resultat-value">100%</p>
				</div>
				<div className="resultat-item">
					<p className="resultat-label">Couleur : </p>
					<p className="resultat-value">100%</p>
				</div>
			</div>
			<p className="resultat-text">Votre grain de beauté ne présente pas d'anomalie</p>
			<div className="button-group">
				<button className="cancel-button">
					<GrUndo size={20} />
					Annuler
				</button>
				<button className="ajouter-button">
					<LuBookImage size={20} />
					Ajouter à un album
				</button>
			</div>
		</div>
	)
}