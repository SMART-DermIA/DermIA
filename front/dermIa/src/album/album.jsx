import React from "react";
import Navbar from "../components/navBar/navbar";
import "./album.css";
import PictureCard from "../components/picture-card/picture_card";
import { MdOutlineFileDownload, MdShare } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

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
			<div className="container-fluid album-buttons">
				<div className="row">
					<div className="col-sm">
						<div className="button-group">
							<button className="secondary-button">
								<MdOutlineFileDownload size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								Télécharger l'album
							</button>
							<button className="primary-button">
							<MdShare size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								Partager à votre médecin traitant
							</button>
						</div>
					</div>
					<div className="col-sm">
						<div className="button-group">
							<button className="delete-button">
								<FaRegTrashAlt size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								Supprimer l'album
							</button>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	)
}