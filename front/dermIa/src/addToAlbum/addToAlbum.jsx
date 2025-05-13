import React, {useEffect, useReducer} from "react";
import Navbar from "../components/navBar/navbar";
import AlbumCard from "./album-card-overview/album_card";
import { Link } from "react-router-dom";
import { LuScanSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import "./AddToAlbum.css";
import {getUsersAlbums} from "../services/AlbumService.js";
import {createAsyncReducer} from "../reducers/asyncReducer.js"

const {asyncReducer: albumsReducer, initialState} = createAsyncReducer([]);

const AddToAlbum = () => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(albumsReducer, initialState);

    // Get a user's albums
    useEffect(() => {
        // Begin async fetch
        dispatch({ type: "FETCH_START" });
        // Get albums
        getUsersAlbums().then(albums =>
          // Finish async fetch with success
          dispatch({ type: "FETCH_SUCCESS", payload: albums })
        ).catch(err => {
            // Finish async fetch with error
            dispatch({type: "FETCH_ERROR", payload: "Could not load recent posts."});
            console.error(err);
        });
    }, []);

    return (
        <div>
            <div className="historique-container">
                <div className="historique-header">
                    <div className="historique-header-text">
                        <h1 className="historique-title">{t("historique.title")}</h1>
                    </div>
                    <div className="historique-header-button">
                        <Link to="/userAccueil" className="nouvelle-button">
                            <LuScanSearch size={20} style={{ marginBottom: ".2em", marginRight: ".5em" }} />
                            {t("addToAlbum.newAlbum")}
                        </Link>
                    </div>
                </div>

                {state.error ? (
                  <div className="historique-albums">
                      <p>{state.error}</p>
                  </div>
                  ) : state.loading ? (
                  <div className="historique-albums">
                      <p>{state.error}</p>
                  </div>
                  ) : (
                  <div className="historique-albums">
                      {state.data.map((album, i) =>
                        <AlbumCard key={i} id={album.id} imageUrl={album.last_photo} title={album.title} lastModified={album.last_updated} />
                      )}
                  </div>
                )}

            </div>
        </div>
    );
};

export default AddToAlbum;