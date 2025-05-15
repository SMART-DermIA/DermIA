import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";
import { MdShare } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { useTranslation } from "react-i18next";

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

    const handleConfirm = async () => {
        if (!image) {
            console.error("Aucune image sélectionnée");
            return;
        }

        setAnalyzing(true);
        const file = await fetch(image)
            .then(r => r.blob())
            .then(blobFile => new File([blobFile], "image.png", { type: "image/png" }));

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: formData,
            });

            const result = await response.json();
            console.log("API replied:", result);

            if (response.ok) {
                setResult(result);
            } else {
                alert(result.error || "Erreur d'analyse");
            }
        } catch (error) {
            console.error("Erreur réseau ou serveur :", error);
            alert("Erreur réseau ou serveur");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleCancel = () => {
        setPreview(false);
        setAnalyzing(false);
        setResult(null);
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
            {upload && (
                <div>
                    <h2 className="upload-title">{t('imgUpload.title')}</h2>
                    <p className="upload-subtitle">
                        {t('imgUpload.subtitle')}
                    </p>
                </div>
            )}

            {upload && (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                    <input {...getInputProps()} />
                    <img src="/iconUpload.png" className="img" alt="Icône upload" />
                    <p className="drop-text">{t('imgUpload.dropText')}</p>
                    <p className="or-text">{t('imgUpload.orText')}</p>
                    <div className="upload-button">{t('imgUpload.chooseFile')}</div>
                </div>
            )}
            
            {preview && (
                <div className="preview-box">
                    {!result && (
                        <div>
                            <img src={image} alt="Aperçu" className="preview-image" />
                            <div className="button-group">
                                <button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t('imgUpload.cancel')}
                                </button>
                                <button className="confirm-button" onClick={handleConfirm}>
                                    <LuScanSearch size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t('imgUpload.analyze')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {analyzing && (
                <div className="analyzing-box">
                    <h2 className="upload-title">{t('imgUpload.analyzing')}</h2>
                    <PiSpinnerGap size={72} className="spinner-icon" />
                </div>
            )}

            {result && !analyzing && (
                <div className="result-box">
                    <h2 className="upload-title">{t('imgUpload.analysisComplete')}</h2>
                    <img src={image} alt="Analyse" className="result-image" />
                
                    <h3
                        className="risk-title"
                        style={{
                            color: result.result === "malignant" ? "#d32f2f" : "#2e7d32",
                            marginTop: "1.2em",
                        }}
                    >
                        {result.result === "malignant"
                            ? t('imgUpload.malignant')
                            : t('imgUpload.benign')} - {t('imgUpload.riskRate')} : {result.danger_rate}% {result.danger_rate > 50 ? `(t('imgUpload.highDanger'))` : ""}
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
                                ? t('imgUpload.highDangerRate')
                                : t('imgUpload.lowDangerRate')}
                        </p>
                        {result.danger_rate > 50 && (
                            <div className="doctor-recommendation">
                                <a href="https://www.doctolib.fr/dermatologue/france" target="_blank" rel="noopener noreferrer">
                                    <button className="doctor-button">
                                        <FaUserMd size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                        {t('imgUpload.findDoctor')}
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                                    
                    <div className="criteria-group">
                        {[
                            { name: t('imgUpload.irregularity') ,   value: result.scores.irregularity },
                            { name: t('imgUpload.asymmetry'),       value: result.scores.asymmetry     },
                            { name: t('imgUpload.size'),            value: result.scores.size          },
                            { name: t('imgUpload.color'),           value: result.scores.color         },
                        ].map(({ name, value }) => {
                            const pct = Math.min(Math.max(value, 0), 100);
                            const hue = 120 - (pct * 120) / 100;
                            const bgColor = `hsl(${hue}, 75%, 50%)`;

                            return (
                            <div key={name} className="criteria-bar">
                                <div className="criteria-label">{name}</div>

                                <div className="bar-wrapper">
                                {/* barre colorée en dessous */}
                                <div
                                    className="bar-fill"
                                    style={{
                                    width: `${pct}%`,
                                    backgroundColor: bgColor,
                                    }}
                                />

                                {/* texte du pourcentage par-dessus */}
                                <span className="bar-text">{pct.toFixed(1)}%</span>

                                {/* graduations 0% — 100% */}
                                <div className="bar-scale">
                                    <span>0%</span>
                                    <span>100%</span>
                                </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    <div className="button-group">
                        <button className="confirm-button">
                            <MdShare size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            {t('imgUpload.share')}
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            {t('imgUpload.cancel')}
                        </button>
                        <button className="confirm-button" onClick={handleConfirm}>
                            <BiPhotoAlbum size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                            {t('imgUpload.addToAlbum')}
                        </button>
                    </div>
                    
                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutan%C3%A9s/excroissances-cutan%C3%A9es-b%C3%A9nignes/grains-de-beaut%C3%A9#Diagnostic_v28368748_fr" className="more-info-link">
                        {t('imgUpload.learnMore')}
                    </a>
                </div>
            )}
        </div>
    );
}