import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";

export default function ImageUpload() {
    const [upload, setUpload] = useState(true);
    const [preview, setPreview] = useState(false);
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file));
        setPreview(true);
        setUpload(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

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
            console.error("Aucune image sélectionnée");
            return;
        }
    
        setConfirmed(true);
    
        /* const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];*/
    
        if (!file) {
            console.error("Fichier introuvable");
            return;
        }
        
        console.log("Fichier prêt à l'envoi :", file);
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const token = localStorage.getItem('token');
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]);
            }            
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log("Résultat de l'analyse :", result);
                // Ici tu pourrais afficher les résultats à l'utilisateur
            } else {
                console.error("Erreur analyse :", result.error || "Erreur inconnue");
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
            {upload || preview ? (
				<div>
					<h2 className="upload-title">Téléchargez votre image pour commencer l’analyse</h2>
					<p className="upload-subtitle">
						Notre IA analyse votre photo pour détecter d’éventuelles anomalies.<br />
						Aucune donnée n’est stockée sans votre accord.
					</p>
                </div>
            ) : null}

            {upload ? (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                <input {...getInputProps()} />
                <img src="/iconUpload.png" className="img" />
                <p className="drop-text">Glissez-déposez votre image ici</p>
                <p className="or-text">ou</p>
                <div className="upload-button">Choisir un fichier depuis votre appareil</div>
            </div>
            ) : null}
            
            {preview ? (
                <div className="preview-box">
                    {!result ? (
						<div><img src={image} alt="Aperçu" className="preview-image" />
							<div className="button-group">
								<button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
									Annuler
								</button>
								<button className="confirm-button" onClick={handleConfirmTemp}>
                                    <LuScanSearch size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    Lancer l’analyse
								</button>
							</div>
						</div>
					) : null}
                </div>
            ) : null}

            {analyzing ? (
                <div className="analyzing-box">
                    <h2 className="upload-title">Analyse en cours...</h2>
                    <PiSpinnerGap size={72} className="spinner-icon" />
                </div>
            ) : null}

            {result ? (
                <div className="result-box">
                    <h2 className="upload-title">Analyse terminée</h2>
                    <img src={image} alt="Analyse" className="result-image" />
                
                    <h3 className="risk-title" style={{ color: "darkgreen", marginTop: "1em" }}>
                    Taux de dangerosité estimé : 15%
                    </h3>
                
                    {/* Barre de risque */}
                    <div className="risk-bar-container">
                    <div className="risk-bar">
                        <div className="risk-indicator" style={{ left: "15%" }} />
                    </div>
                    <p className="risk-message">
                        Bonne nouvelle ! Votre grain de beauté ne présente pas d’anomalie
                    </p>
                    </div>
                
                    {/* Détails d’analyse */}
                    <div className="criteria-grid">
                    <div><span style={{ color: "#660033" }}>Irrégularité</span> <span>30%</span></div>
                    <div><span style={{ color: "#660033" }}>Assymétrie</span> <span>50%</span></div>
                    <div><span style={{ color: "#660033" }}>Taille</span> <span>20%</span></div>
                    <div><span style={{ color: "#660033" }}>Couleur</span> <span>10%</span></div>
                    </div>
                
                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutanés/excroissances-cutanées-bénignes/grains-de-beauté#Diagnostic_v28368748_fr" className="more-info-link">En savoir plus sur les grains de beauté.</a>
                    <div className="button-group">
								<button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
									Annuler
								</button>
								<button className="confirm-button" onClick={handleConfirmTemp}>
                                    <BiPhotoAlbum size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    Ajouter à un album
								</button>
							</div>
                </div>
            ) : null}
        </div>
    );
}
