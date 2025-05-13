import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";
import { MdShare } from "react-icons/md";
import { FaUserMd } from "react-icons/fa"; // Icon for the doctor button

export default function ImageUpload() {
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
                    <h2 className="upload-title">Téléchargez votre image pour commencer l’analyse</h2>
                    <p className="upload-subtitle">
                        Notre IA analyse votre photo pour détecter d’éventuelles anomalies.<br />
                        Aucune donnée n’est stockée sans votre accord.
                    </p>
                </div>
            )}

            {upload && (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                    <input {...getInputProps()} />
                    <img src="/iconUpload.png" className="img" alt="Icône upload" />
                    <p className="drop-text">Glissez-déposez votre image ici</p>
                    <p className="or-text">ou</p>
                    <div className="upload-button">Choisir un fichier depuis votre appareil</div>
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
                    <h2 className="upload-title">Analyse en cours...</h2>
                    <PiSpinnerGap size={72} className="spinner-icon" />
                </div>
            )}

            {result && !analyzing && (
                <div className="result-box">
                    <h2 className="upload-title">Analyse terminée</h2>
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
                            { name: 'Irrégularité', value: result.scores.irregularity },
                            { name: 'Asymétrie',     value: result.scores.asymmetry     },
                            { name: 'Taille',        value: result.scores.size          },
                            { name: 'Couleur',       value: result.scores.color         },
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
                    
                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutanés/excroissances-cutanées-bénignes/grains-de-beauté#Diagnostic_v28368748_fr" className="more-info-link">
                        En savoir plus sur les grains de beauté.
                    </a>
                </div>
            )}
        </div>
    );
}