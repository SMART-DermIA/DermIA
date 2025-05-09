import React from "react";
import Navbar from "../components/navBar/navbar";
import "./album.css";
import PictureCard from "../components/picture-card/picture_card";

export default function Album() {
	return (
		<div>
			<Navbar />
			<div className="container-fluid">
				<h1 className="album-title">Album : Album title</h1>
				<h3 className="album-subtitle">Créé le [date] | Dernier mise à jour : [date]</h3>
				<h3 className="album-subtitle-2">Dernier taux de dangerosité : 90 % (risque élevé)</h3>
				<div className="album-scroll">
					<PictureCard image={"/image1.png"} date="2023-10-01" dangerosite="0" />
					<PictureCard image={"/image2.png"} date="2023-10-01" dangerosite="0" />
					<PictureCard image={"/image3.png"} date="2023-10-01" dangerosite="0" />
					<PictureCard image={"/image1.png"} date="2023-10-01" dangerosite="1" />
					<PictureCard image={"/image2.png"} date="2023-10-01" dangerosite="2" />
					<PictureCard image={"/image3.png"} date="2023-10-01" dangerosite="3" />
					<PictureCard image={"/image3.png"} date="2023-10-01" dangerosite="3" />
					<PictureCard image={"/image3.png"} date="2023-10-01" dangerosite="3" />
				</div>
			</div>
			<div className="album-stats">
				<div className="container-fluid">
				<h1 className="album-title">Statistiques d'évolution</h1>
				<p>Ce graphique montre l'évolution des paramètres analysés (taille, couleur, asymétrie, etc.) sur les photos</p>
				</div>
			</div>
		</div>
	)
}