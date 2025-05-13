import React, { useEffect, useReducer, useState } from "react";
import Navbar from "../components/navBar/navbar";
import { useTranslation } from "react-i18next";
import "./AddToAlbum.css";
import { getUsersAlbums, createAlbum } from "../services/AlbumService.js";
import { createAsyncReducer } from "../reducers/asyncReducer.js";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

const { asyncReducer: albumsReducer, initialState } = createAsyncReducer([]);

const AddToAlbum = () => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(albumsReducer, initialState);
    const [albumTitle, setAlbumTitle] = useState("");
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [image, setImage] = useState(null); // Imagen recuperada del Local Storage

    useEffect(() => {
        // Recupera la imagen del Local Storage
        const storedImage = localStorage.getItem("uploadedImage");
        if (storedImage) {
            setImage(storedImage);
        }

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
            await axios.post(`${API_BASE_URL}/albums/${selectedAlbum}/add-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(t("addToAlbum.addedToAlbum"));
        } catch (err) {
            console.error(err);
            alert(t("addToAlbum.error"));
        }
    };

    return (
        <div>
            <div className="historique-container">
                <div className="historique-header">
                    <div className="historique-header-text">
                        <h1 className="historique-title">{t("historique.title")}</h1>
                    </div>
                    <div className="historique-header-button">
                        <input
                            type="text"
                            placeholder={t("addToAlbum.albumTitlePlaceholder")}
                            value={albumTitle}
                            onChange={(e) => setAlbumTitle(e.target.value)}
                            className="album-title-input"
                        />
                        <button className="nouvelle-button" onClick={handleCreateAlbum}>
                            {t("addToAlbum.createAlbum")}
                        </button>
                    </div>
                </div>

                <div className="existing-albums">
                    <h2>{t("addToAlbum.selectAlbum")}</h2>
                    <select
                        value={selectedAlbum || ""}
                        onChange={(e) => setSelectedAlbum(e.target.value)}
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

export default AddToAlbum;