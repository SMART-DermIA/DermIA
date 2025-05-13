import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";
import { MdShare } from "react-icons/md";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

export default function ImageUpload() {
    const { t } = useTranslation();
    const [upload, setUpload] = useState(true);
    const [preview, setPreview] = useState(false);
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file));
        setPreview(true);
        setUpload(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop
    });

    const handleConfirmTemp = () => {
        setAnalyzing(true);
        setUpload(false);
        setPreview(false);
        
        setTimeout(() => {
            // Simulate an API call
            setResult(true);
            setAnalyzing(false);
            setPreview(false);
        }, 3000);

    };
    const handleConfirm = async () => {
        if (!file) {
            console.error(t("imgUpload.noImageSelected"));
            return;
        }
    
        setConfirmed(true);
    
        /* const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];*/
    
        if (!file) {
            console.error(t("imgUpload.fileNotFound"));
            return;
        }
        
        console.log(t("imgUpload.fileReady"), file);
        const formData = new FormData();
        formData.append('image', file);

        try {
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]);
            }            
            const response = await axios.post(`${API_BASE_URL}/analyze`, formData,{
                withCredentials: true,
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });

            const result = await response.json();
            console.log("API replied:", result);

            if (response.ok) {
                console.log(t("imgUpload.analysisResult"), result);
                // Ici tu pourrais afficher les résultats à l'utilisateur
            } else {
                console.error(t("imgUpload.analysisError"), result.error || t("imgUpload.unknownError"));
                alert(result.error || t("imgUpload.analysisError"));
            }
        } catch (error) {
            console.error(t("imgUpload.networkError"), error);
            alert(t("imgUpload.networkError"));
        }
    };

    const handleCancel = () => {
        setPreview(false);
        setAnalyzing(false);
        setResult(false);
        setUpload(true);
        setImage(null);
    };	

    useEffect(() => {
        let timer;
        if (analyzing) {
            timer = setTimeout(() => {}, 1000);
        }
        return () => clearTimeout(timer);
    }, [analyzing]);

    return (
        <div className="upload-container">
            {upload || preview ? (
                <div>
                    <h2 className="upload-title">{t("imgUpload.title")}</h2>
                    <p className="upload-subtitle">
                        {t("imgUpload.subtitle")}
                    </p>
                </div>
            )}

            {upload && (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                <input {...getInputProps()} />
                <img src="/iconUpload.png" className="img" />
                <p className="drop-text">{t("imgUpload.dropText")}</p>
                <p className="or-text">{t("imgUpload.orText")}</p>
                <div className="upload-button">{t("imgUpload.chooseFile")}</div>
            </div>
            ) : null}
            
            {preview && (
                <div className="preview-box">
                    {!result && (
                        <div>
                            <img src={image} alt="Aperçu" className="preview-image" />
                            <div className="button-group">
                                <button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    Annuler
                                </button>
                                <button className="confirm-button" onClick={handleConfirm}>
                                    <LuScanSearch size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    Lancer l’analyse
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {analyzing && (
                <div className="analyzing-box">
                    <h2 className="upload-title">{t("imgUpload.analyzing")}</h2>
                    <PiSpinnerGap size={72} className="spinner-icon" />
                </div>
            )}

            {result && !analyzing && (
                <div className="result-box">
                    <h2 className="upload-title">{t("imgUpload.analysisComplete")}</h2>
                    <img src={image} alt="Analyse" className="result-image" />
                
                    <h3
                        className="risk-title"
                        style={{
                            color: result.result === "malignant" ? "#d32f2f" : "#2e7d32",
                            marginTop: "1.2em",
                        }}
                    >
                        {result.result === "malignant"
                            ? "Potentiellement maligne"
                            : "Bénigne"} – Taux de dangerosité estimé : {result.danger_rate}% {result.danger_rate > 50 ? "(risque élevé)" : ""}
                    </h3>

                    <div className="risk-bar-container">
                        <div className="risk-bar">
                            <div 
                                className="risk-indicator" 
                                style={{ left: `${result.danger_rate}%` }} 
                            />
                        </div>
                        <p 
                            className="risk-message"
                            style={{
                                color: result.danger_rate > 50 ? "#d32f2f" : "#2e7d32",
                            }}
                        >
                            {result.danger_rate > 50
                                ? "Attention : consultez un dermatologue"
                                : "Bonne nouvelle ! Votre grain ne présente pas d’anomalie."}
                        </p>
                        {result.danger_rate > 50 && (
                            <div className="doctor-recommendation">
                                <a href="https://www.doctolib.fr/dermatologue/france" target="_blank" rel="noopener noreferrer">
                                    <button className="doctor-button">
                                        <FaUserMd size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                        Chercher un dermato
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                
                    <div className="criteria-group">
                        {[
                            { name: 'Irrégularité', value: result.scores.irregularity, color: '#f39c12' },
                            { name: 'Asymétrie', value: result.scores.asymmetry, color: '#2980b9' },
                            { name: 'Taille', value: result.scores.size, color: '#27ae60' },
                            { name: 'Couleur', value: result.scores.color, color: '#8e44ad' },
                        ].map(({ name, value, color }) => (
                            <div key={name} className="criteria-bar">
                                <div className="criteria-label">{name}</div>
                                <div className="bar-wrapper">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${value}%`,
                                            backgroundColor: color,
                                        }}
                                    >
                                        {value}%
                                    </div>
                                    <div className="bar-scale">
                                        <span>0%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutanés/excroissances-cutanées-bénignes/grains-de-beauté#Diagnostic_v28368748_fr" className="more-info-link">
                        En savoir plus sur les grains de beauté.
                    </a>

                    <div className="button-group">
                        <button className="confirm-button">
                            <MdShare size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            Partager à votre médecin traitant
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            Annuler
                        </button>
                        <button className="confirm-button" onClick={handleConfirm}>
                            <BiPhotoAlbum size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            Ajouter à un album
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}