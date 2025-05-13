import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SaveAnalysis.css";
import {createAlbum, getUsersAlbums} from "../services/AlbumService.js";
import { createAsyncReducer } from "../reducers/asyncReducer.js";
import axios from "axios";

const { asyncReducer: albumsReducer, initialState } = createAsyncReducer([]);

export default function SaveAnalysis() {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null)
  const [state, dispatch] = useReducer(albumsReducer, initialState);

  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    // Recupera la imagen del Local Storage
    const analysis_string = localStorage.getItem("analysis");

    if (analysis_string) {
      const retrieved_analysis = JSON.parse(analysis_string)
      setAnalysis(retrieved_analysis);
    }

    // Recupera los albums
    dispatch({ type: "FETCH_START" });
    getUsersAlbums()
        .then((albums) => dispatch({ type: "FETCH_SUCCESS", payload: albums }))
        .catch((err) => {
          dispatch({ type: "FETCH_ERROR", payload: "Could not load recent posts." });
          console.error(err);
        });
  }, []);

  const handleCreateAlbum = async () => {
    if (!albumTitle || !image) {
      alert(t("addToAlbum.missingFields"));
      return;
    }

    const storedImage = null;

    const file = storedImage;

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("image", file);

    try {
      const newAlbum = await createAlbum(formData);
      alert(t("addToAlbum.success"));
      dispatch({ type: "FETCH_SUCCESS", payload: [...state.data, newAlbum] });
    } catch (err) {
      console.error(err);
      alert(t("addToAlbum.error"));
    }
  };

  const handleAddToExistingAlbum = async () => {
    if (!selectedAlbum || !image) {
      alert(t("addToAlbum.missingFields"));
      return;
    }

    const formData = new FormData();
    formData.append("albumId", selectedAlbum);
    formData.append("image", image);

    try {
      // await axios.post(`${API_BASE_URL}/albums/${selectedAlbum}/add-image`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      alert(t("addToAlbum.addedToAlbum"));
    } catch (err) {
      console.error(err);
      alert(t("addToAlbum.error"));
    }
  };

  if (!analysis) return (
    <div>Waiting</div>
  )

  return (
    <div>
      <img src={analysis.image} alt={"Photo of analysed mole"} />

      <div className="historique-container">
        <div className="historique-header">
          <div className="historique-header-text">
            <h1 className="historique-title">{t("historique.title")}</h1>
          </div>
          <div className="historique-header-button">
            <input type="text" placeholder={t("addToAlbum.albumTitlePlaceholder")} value={albumTitle}
                   onChange={(e)=> setAlbumTitle(e.target.value)}
                   className="album-title-input"
            />
            <button className="nouvelle-button" onClick={handleCreateAlbum}>
              {t("addToAlbum.createAlbum")}
            </button>
          </div>
        </div>

        <div className="existing-albums">
          <h2>{t("addToAlbum.selectAlbum")}</h2>
          <select value={selectedAlbum || "" } onChange={(e)=> setSelectedAlbum(e.target.value)}
                  className="album-select"
          >
            <option value="">{t("addToAlbum.selectAlbumPlaceholder")}</option>
            {state.data.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
          <button className="add-to-album-button" onClick={handleAddToExistingAlbum}>
            {t("addToAlbum.addToExistingAlbum")}
          </button>
        </div>

        {state.error ? (
          <div className="historique-albums">
            <p>{state.error}</p>
          </div>
        ) : state.loading ? (
          <div className="historique-albums">
            <p>{t("addToAlbum.loading")}</p>
          </div>
        ) : (
          <div className="historique-albums">
            {state.data.map((album, i) => (
              <div key={i} className="album-card">
                <p>{album.title}</p>
                <img src={album.last_photo} alt={album.title} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);
};