import React, {useEffect, useReducer} from "react";
import Navbar from "../components/navBar/navbar";
import "./album.css";
import PictureCard from "../components/picture-card/picture_card";
import { MdOutlineFileDownload, MdShare } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import ApexChart from "../components/chart";
import { useTranslation } from "react-i18next";
import {getAlbum} from "../services/AlbumService.js";
import {createAsyncReducer} from "../reducers/asyncReducer.js";
import {useParams} from "react-router-dom";
import NotFound from "../NotFound.jsx";
import BodyMap from "../components/body-map/BodyMap.jsx";
import AlbumCard from "../components/album-card/album_card.jsx";

const {asyncReducer: albumReducer, initialState} = createAsyncReducer(null);

export default function Album() {
	const { id } = useParams();
	const id_n = parseInt(id);

	const { t } = useTranslation();
	const [state, dispatch] = useReducer(albumReducer, initialState);

	useEffect(() => {
		if (!isNaN(id_n)) {
			dispatch({type: "FETCH_START"});
			getAlbum(id_n).then(album =>
				dispatch({type: "FETCH_SUCCESS", payload: album})
			).catch(err => {
				dispatch({type: "FETCH_ERROR", payload: "Could not load album."});
				console.error(err);
			});
		}
	}, [id_n]);

	if (isNaN(id_n))
		return <NotFound />

	return (
		<div>
			<Navbar />
			<div className="container-fluid">
				{state.error ? (
					<div className="historique-albums"><p>{state.error}</p></div>
				) : state.loading ? (
					<div className="historique-albums"><p>Chargement...</p></div>
				) : (
					<>
						<h1 className="album-title">{t('album.album')}: {state.data.title}</h1>

						<h3 className="album-subtitle">{t('album.creation')}: {state.data.oldest_analysis_date}</h3>
						<h3 className="album-subtitle">{t('album.lastModified')}: {state.data.newest_analysis_date}</h3>
						<h3 className="album-subtitle-2">{t('album.dernierDangerosite')}: {state.data.newest_analysis_severity} </h3>
						<div className="album-scroll">
							{
								state.data.analyses.map((analysis, i) =>
									<PictureCard key={i} image={analysis.photo} date={analysis.date} dangerosite={analysis.result} />
								)
							}
						</div>
					</>
				)}
			</div>
			<div className="album-stats">
				<div className="container-fluid">
				<h1 className="album-title">{t('album.statTitle')}</h1>
				<p>{t('album.statDescription')}</p>
				<div className="album-chart" style={{ display: "flex", justifyContent: "center", alignItems: "center"  }}>
					<ApexChart />
				</div>
				</div>
			</div>
			<div className="container-fluid album-buttons">
				<div className="row">
					<div className="col-sm">
						<div className="button-group">
							<button className="secondary-button">
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