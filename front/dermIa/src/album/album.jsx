import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar/navbar";
import "./album.css";
import PictureCard from "../components/picture-card/picture_card";
import { MdOutlineFileDownload, MdShare } from "react-icons/md";
import { LuUndo2 } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import ApexChart from "../components/chart";
import { useTranslation } from "react-i18next";
import { generatePDF } from "../services/PdfService";

export default function Album() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleUndo = () => {
		navigate("/historique");
	}

	// remplacer par une requête API pour récupérer les données de l'album
	const userData = {
		userName: "John Doe",
		age: "30",
		medecinTraitant: "Dr. Smith",
	}

	const albumData = {
		title: "Album title",
		creationDate: "2023-10-01",
		lastModified: "2023-10-05",
		dangerosite: "90%",
		images: [
		  { image: "/image1.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image1.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image1.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image1.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image3.png", date: "2023-10-01", dangerosite: 0 },
		  { image: "/image2.png", date: "2023-10-01", dangerosite: 0 }
		]
	};

	const handleGeneratePDF = async () => {
		await generatePDF(userData, albumData, ".album-chart-static");
	}

	return (
		<div>
			<Navbar />
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm">
						<h1 className="album-title">{t('album.album')} Album title</h1>
						<h3 className="album-subtitle">{t('album.creation')} [date] | {t('album.lastModified')} [date]</h3>
						<h3 className="album-subtitle-2">{t('album.dernierDangerosite')} 90 % (risque élevé)</h3>
					</div>
					<div className="col-sm d-flex justify-content-end d-none d-md-flex">
						<LuUndo2 className="album-undo" size={48} onClick={handleUndo}/>
					</div>
				</div>
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
				<h1 className="album-title">{t('album.statTitle')}</h1>
				<p>{t('album.statDescription')}</p>
				<div className="album-chart" style={{ display: "flex", justifyContent: "center", alignItems: "center"  }}>
					<ApexChart />
				</div>
				<div
				className="album-chart-static"
				style={{
					width: "600px",
					height: "400px",
					position: "absolute",
					top: "-9999px",
					left: "-9999px"
				}}
				>
				<ApexChart />
				</div>
				</div>
			</div>
			<div className="container-fluid album-buttons">
				<div className="row">
					<div className="col-sm">
						<div className="button-group">
							<button className="secondary-button" onClick={handleGeneratePDF}>
								<MdOutlineFileDownload size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								{t('album.buttonTelecharger')}
							</button>
							<button className="primary-button">
							<MdShare size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								{t('album.buttonPartager')}
							</button>
						</div>
					</div>
					<div className="col-sm">
						<div className="button-group">
							<button className="delete-button">
								<FaRegTrashAlt size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
								{t('album.buttonSupprimer')}
							</button>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	)
}