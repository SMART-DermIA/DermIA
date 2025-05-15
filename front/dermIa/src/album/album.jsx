import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar/navbar";
import "./album.css";
import PictureCard from "../components/picture-card/picture_card";
import { MdOutlineFileDownload, MdShare } from "react-icons/md";
import { LuUndo2 } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import ApexChart from "../components/chart";
import { useAuth } from "../auth/authContext.jsx";
import { useTranslation } from "react-i18next";
import {
  getAlbum,
  deleteAlbum,
  deleteAnalysis,
} from "../services/AlbumService.js";
import { createAsyncReducer } from "../reducers/asyncReducer.js";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound.jsx";
import { toast } from "react-toastify";

const { asyncReducer: albumReducer, initialState } = createAsyncReducer(null);
import { generatePDF } from "../services/PdfService";

export default function Album() {
  const { id } = useParams();
  const id_n = parseInt(id);

  const { user } = useAuth();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePictureClick = (analysis) => {
    setSelectedAnalysis(analysis);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (!isNaN(id_n)) {
      dispatch({ type: "FETCH_START" });
      getAlbum(id_n)
        .then((album) => dispatch({ type: "FETCH_SUCCESS", payload: album }))
        .catch((err) => {
          dispatch({ type: "FETCH_ERROR", payload: "Could not load album." });
          console.error(err);
        });
    }
  }, [id_n]);

  if (isNaN(id_n)) return <NotFound />;
  const navigate = useNavigate();

  const handleUndo = () => {
    navigate("/historique");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Cierra el popup
  };

  const userData = {
    userName: user.prenom + " " + user.nom,
    email: user.email,
    medecinTraitant: user.doctor_name,
  };

  const albumData = state.data
    ? {
        title: state.data.title,
        creationDate: new Date(
          state.data.oldest_analysis_date
        ).toLocaleDateString(),
        lastModified: new Date(
          state.data.newest_analysis_date
        ).toLocaleDateString(),
        dangerosite: state.data.newest_analysis_danger_rate,
        images: state.data.analyses.map((analysis) => ({
          image: analysis.photo,
          date: new Date(analysis.date).toLocaleDateString(),
          dangerosite: analysis.danger_rate,
        })),
      }
    : null;

  const dates = state.data
    ? state.data.analyses.map((analysis) =>
        new Date(analysis.date).toLocaleDateString()
      )
    : [];
  const danger_rates = state.data
    ? state.data.analyses.map((analysis) => analysis.danger_rate)
    : [];
  const asymmetry = state.data
    ? state.data.analyses.map((analysis) => analysis.asymmetry)
    : [];
  const irregularity = state.data
    ? state.data.analyses.map((analysis) => analysis.irregularity)
    : [];
  const color = state.data
    ? state.data.analyses.map((analysis) => analysis.color)
    : [];
  const size = state.data
    ? state.data.analyses.map((analysis) => analysis.size)
    : [];

  const handleGeneratePDF = async () => {
    if (!albumData) return;
    await generatePDF(userData, albumData, ".album-chart-static");
  };

  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm(t("historique.confirmDelete"))) {
      try {
        await deleteAlbum(id_n);
        toast.success(t("historique.deleteSuccess"));
        navigate("/historique");
      } catch (error) {
        console.error(error);
        toast.error(t("historique.deleteError"));
      }
    }
  };

  // 1. wrapper appel API
  const deleteAnalysisApi = (analysisId) => deleteAnalysis(id_n, analysisId);

  // 2. gestion du succès
  const onAnalysisDeleted = (analysisId) => {
    dispatch({
      type: "FETCH_SUCCESS",
      payload: {
        ...state.data,
        analyses: state.data.analyses.filter((a) => a.id !== analysisId),
      },
    });
    toast.success(t("pictureCard.deleteSuccess"));
  };

  // 3. orchestration FR/EN
  const handleDeleteClick = (analysisId) => {
    if (!window.confirm(t("pictureCard.confirmDelete"))) return;

    deleteAnalysisApi(analysisId)
      .then((response) => {
        if (response.albumDeleted) {
          // plus d'images → on redirige après toast
          toast.success("Album supprimé");
          navigate("/historique");
        } else {
          // on reste sur la même page, on met à jour la liste
          onAnalysisDeleted(analysisId);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("pictureCard.deleteError"));
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        {state.error ? (
          <div className="historique-albums">
            <p>{state.error}</p>
          </div>
        ) : state.loading ? (
          <div className="historique-albums">
            <p>Chargement...</p>
          </div>
        ) : (
          <>
          	<div className="row">
              <div className="col-sm">
                <h1 className="album-title">
                  {t("album.album")}: {state.data.title}
                </h1>

                <h3 className="album-subtitle">
                  {t("album.creation")}:{" "}
                  {new Date(state.data.oldest_analysis_date).toLocaleDateString()}
                </h3>
                <h3 className="album-subtitle">
                  {t("album.lastModified")}:{" "}
                  {new Date(state.data.newest_analysis_date).toLocaleDateString()}
                </h3>
                <h3 className="album-subtitle-2">
                  {t("album.dernierDangerosite")}:{" "}
                  {state.data.newest_analysis_danger_rate}{" "}
                </h3>
              </div>
              <div className="col-sm d-flex justify-content-end d-none d-md-flex">
                <LuUndo2 className="album-undo" size={48} onClick={handleUndo}/>
              </div>
            </div>
            <div className="album-scroll">
              {state.data.analyses.map((analysis) => (
                <PictureCard
                  key={analysis.id}
                  image={analysis.photo}
                  date={new Date(analysis.date).toLocaleDateString()}
                  dangerosite={analysis.result}
                  analysisId={analysis.id}
                  onDelete={handleDeleteClick}
				          onClick={() => handlePictureClick(analysis)}
                />
              ))}
            </div>
          </>
        )}
      </div>

	  {isPopupOpen && selectedAnalysis && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup" onClick={handleClosePopup}>
                            &times;
                        </button>
                        <h3>{t("album.analysisDetails")}</h3>
                        <ul>
                            <li>{t("album.date")}: {new Date(selectedAnalysis.date).toLocaleDateString()}</li>
                            <li>{t("album.dangerRate")}: {selectedAnalysis.danger_rate}</li>
                            <li>{t("album.asymmetry")}: {selectedAnalysis.asymmetry}</li>
                            <li>{t("album.irregularity")}: {selectedAnalysis.irregularity}</li>
                            <li>{t("album.color")}: {selectedAnalysis.color}</li>
                            <li>{t("album.size")}: {selectedAnalysis.size}</li>
                        </ul>
                    </div>
                </div>
            )}
			
      <div className="album-stats">
        <div className="container-fluid">
          <h1 className="album-title">{t("album.statTitle")}</h1>
          <p>{t("album.statDescription")}</p>
          <div
            className="album-chart"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ApexChart dates={dates} irregularity={irregularity} asymmetry={asymmetry} size={size} color={color} mean={danger_rates} />
          </div>
          <div
            className="album-chart-static"
            style={{
              width: "700px",
              height: "400px",
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
            }}
          >
            <ApexChart dates={dates} irregularity={irregularity} asymmetry={asymmetry} size={size} color={color} mean={danger_rates} />
          </div>
        </div>
      </div>
      <div className="container-fluid album-buttons">
        <div className="row">
          <div className="col-sm">
            <div className="button-group">
              <button className="secondary-button" onClick={handleGeneratePDF}>
                <MdOutlineFileDownload
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("album.buttonTelecharger")}
              </button>
              <button className="primary-button">
                <MdShare
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("album.buttonPartager")}
              </button>
            </div>
          </div>
          <div className="col-sm">
            <div className="button-group">
              <button
                className="delete-button"
                onClick={() => handleDeleteAlbum(id_n)}
              >
                <FaRegTrashAlt
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("album.buttonSupprimer")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
