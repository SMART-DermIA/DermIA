import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";

export default function ImageUpload() {
    const [preview, setPreview] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [file, setFile] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
        setPreview(URL.createObjectURL(file));
        setConfirmed(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop
    });

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
		setPreview(null);
		setConfirmed(false);
	};	

    return (
        <div className="upload-container">
            {!confirmed ? (
				<div>
					<h2 className="upload-title">Téléchargez votre image pour commencer l’analyse</h2>
					<p className="upload-subtitle">
						Notre IA analyse votre photo pour détecter d’éventuelles anomalies.<br />
						Aucune donnée n’est stockée sans votre accord.
					</p>
				</div>) : (null)}

            {!preview ? (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                    <input {...getInputProps()} />
                    <img src="/iconUpload.png" className="img" />
                    <p className="drop-text">Glissez-déposez votre image ici</p>
                    <p className="or-text">ou</p>
                    <div className="upload-button">Choisir un fichier depuis votre appareil</div>
                </div>
            ) : (
                <div className="preview-box">
                    {!confirmed ? (
						<div><img src={preview} alt="Aperçu" className="preview-image" />
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
					) : (
						<div className="analyzing-box">
							<h2 className="upload-title">Analyse en cours...</h2>
							<PiSpinnerGap size={72} className="spinner-icon" />
						</div>
					)}
                </div>
            )}
        </div>
    );
}
