import React from "react";
import Navbar from "../components/navBar/navbar";
import AlbumCard from "../components/album-card/album_card";
import { Link } from "react-router-dom";
import { LuScanSearch } from "react-icons/lu";
import "./historique.css";

const Historique = () => {
    return (
        <div>
            <Navbar />
            <div className="historique-container">
                <div className="historique-header">
                    <div className="historique-header-text">
                        <h1 className="historique-title">Vos albums</h1>
                        <p className="historique-subtitle">Suivez l'évolution de chacun de vos grains de beauté</p>
                    </div>
                    <div className="historique-header-button">
                    <Link to="/userAccueil" className="nouvelle-button" >
                        <LuScanSearch size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                        Nouvelle analyse
                    </Link>
                    </div>
                </div>
                <div className="historique-albums">
                    <AlbumCard imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                </div>
            </div>
        </div>
    )
}

export default Historique;