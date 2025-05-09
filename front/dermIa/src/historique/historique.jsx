import React from "react";
import Navbar from "../components/navBar/navbar";
import AlbumCard from "../components/album-card/album_card";
import { Link } from "react-router-dom";
import { LuScanSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import "./historique.css";

const Historique = () => {
    const { t } = useTranslation();

    return (
        <div>
            <Navbar />
            <div className="historique-container">
                <div className="historique-header">
                    <div className="historique-header-text">
                        <h1 className="historique-title">{t("historique.title")}</h1>
                        <p className="historique-subtitle">{t("historique.subtitle")}</p>
                    </div>
                    <div className="historique-header-button">
                        <Link to="/userAccueil" className="nouvelle-button">
                            <LuScanSearch size={20} style={{ marginBottom: ".2em", marginRight: ".5em" }} />
                            {t("historique.newAnalysis")}
                        </Link>
                    </div>
                </div>
                <div className="historique-albums">

                    <AlbumCard id="1" imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard id="2" imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard id="3" imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard id="1" imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard id="2" imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard id="3" imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard id="1" imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard id="2" imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard id="3" imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard id="1" imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard id="2" imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard id="3" imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                    <AlbumCard id="1" imageUrl="/image1.png" title="Album 1" lastModified="2023-10-01" />
                    <AlbumCard id="2" imageUrl="/image2.png" title="Album 2" lastModified="2023-10-02" />
                    <AlbumCard id="3" imageUrl="/image3.png" title="Album 3" lastModified="2023-10-03" />
                </div>
            </div>
        </div>
    );
};

export default Historique;