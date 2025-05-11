import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";
import { MdShare } from "react-icons/md";

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
            console.log(" API replied:", result);

            if (response.ok) {
                setResult(result);
            } else {
                alert(result.error || "Erreur d'analyse");
            }
        } catch (error) {
            console.error("Erreur réseau ou serveur :", error);
            alert("Erreur réseau ou serveur");
        }
    };

    const handleCancel = () => {
        setPreview(false);
        setAnalyzing(false);
        setResult(false);
        setUpload(true);
        setImage(null);
    };    

    return (
        <div className="upload-container">
            {(upload || preview) && (
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

            {result && !analyzing ? (
                <div className="result-box">
                    <h2 className="upload-title">Analyse terminée</h2>
                    <img src={image} alt="Analyse" className="result-image" />
                
                    <h3
                        className="risk-title"
                        style={{
                            color: result.result === "malignant" ? "darkred" : "darkgreen",
                            marginTop: "1em",
                        }}
                    >
                        {result.result === "malignant"
                            ? "Potentiellement maligne"
                            : "Bénigne"}{" "}
                        – Taux de dangerosité estimé : {result.danger_rate}%
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
                                color: result.result === "malignant" ? "darkred" : "darkgreen",
                            }}
                        >
                              {result.danger_rate > 50
                               ? "Attention, taux de dangerosité élevé."
                               : "Bonne nouvelle ! Votre grain ne présente pas d’anomalie."}
                        </p>
                    </div>
                
                    <div className="criteria-grid">
                        <div><span style={{ color: "#660033" }}>Irrégularité</span> <span>30%</span></div>
                        <div><span style={{ color: "#660033" }}>Assymétrie</span> <span>50%</span></div>
                        <div><span style={{ color: "#660033" }}>Taille</span> <span>20%</span></div>
                        <div><span style={{ color: "#660033" }}>Couleur</span> <span>10%</span></div>
                    </div>
                
                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutanés/excroissances-cutanées-bénignes/grains-de-beauté#Diagnostic_v28368748_fr" className="more-info-link">
                        En savoir plus sur les grains de beauté.
                    </a>

                    <div className="row">
                        <div className="col-sm mb-3">
                            <button className="confirm-button">
                                <MdShare size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                Partager à votre médecin traitant
                            </button>
                        </div>
                        <div className="col-sm mb-3 button-group">
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
                </div>
            ) : null}
        </div>
    );
}