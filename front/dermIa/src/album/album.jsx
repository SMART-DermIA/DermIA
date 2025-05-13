import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navBar/navbar";
import PictureCard from "../components/picture-card/picture_card";
import ApexChart from "../components/chart";
import { MdOutlineFileDownload, MdShare } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getUsersAlbums } from "../services/AlbumService";

export default function Album() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsersAlbums()
      .then(albums => {
        const album = albums.find(a => a.id.toString() === id);
        setAlbumData(album);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement :", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!albumData) return <div>Album non trouvé</div>;

  const maxDangerosite = Math.max(...(albumData.photos?.map(p => p.dangerosity) || [0]));

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <h1 className="album-title">{t('album.album')} {albumData.title}</h1>
        <h3 className="album-subtitle">
          {t('album.creation')} {albumData.created_at} | {t('album.lastModified')} {albumData.last_updated}
        </h3>
        <h3 className="album-subtitle-2">
          {t('album.dernierDangerosite')} {maxDangerosite * 30} % (risque élevé)
        </h3>
        <div className="album-scroll">
          {albumData.photos?.map((photo, index) => (
            <PictureCard
              key={index}
              image={photo.url}
              date={photo.taken_at}
              dangerosite={photo.dangerosity}
            />
          ))}
        </div>
      </div>

      <div className="album-stats">
        <div className="container-fluid">
          <h1 className="album-title">{t('album.statTitle')}</h1>
          <p>{t('album.statDescription')}</p>
          <div className="album-chart" style={{ display: "flex", justifyContent: "center" }}>
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
  );
}