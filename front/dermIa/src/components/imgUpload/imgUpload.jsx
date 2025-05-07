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

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        setConfirmed(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop
    });

    const handleConfirm = () => {
        setConfirmed(true);
        console.log("Image confirmée");
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
