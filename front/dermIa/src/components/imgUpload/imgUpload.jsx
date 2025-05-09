import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";

export default function ImageUpload() {
  // Etats
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // URL de l'API
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log("ENV VAR API_BASE_URL =", API_BASE_URL);

  // Gestion du drop
  const onDrop = useCallback((acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
    setAnalyzing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  // Simule un appel API (temporaire)
  const handleConfirmTemp = () => {
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setResult({ result: "benign", confidence: 0.85 });
    }, 2000);
  };

  // Vrai appel API
  const handleConfirm = async () => {
    if (!file) {
      console.error("Aucune image sélectionnée");
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Résultat de l'analyse :", data);
        setResult(data);
      } else {
        console.error("Erreur analyse :", data.error || "Erreur inconnue");
        alert(data.error || "Erreur d'analyse");
      }
    } catch (err) {
      console.error("Erreur réseau ou serveur :", err);
      alert("Erreur réseau ou serveur");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(false);
    setAnalyzing(false);
    setResult(null);
  };

  return (
    <div className="upload-container">
      {/* Message d'instruction */}
      {!preview && !analyzing && !result && (
        <div>
          <h2 className="upload-title">
            Téléchargez votre image pour commencer l’analyse
          </h2>
          <p className="upload-subtitle">
            Notre IA analyse votre photo pour détecter d’éventuelles anomalies.
            <br />
            Aucune donnée n’est stockée sans votre accord.
          </p>
        </div>
      )}

      {/* Zone de drop */}
      {!preview && !analyzing && !result && (
        <div
          {...getRootProps()}
          className={`upload-box ${isDragActive ? "drag-active" : ""}`}
        >
          <input {...getInputProps()} />
          <img src="/iconUpload.png" className="img" />
          <p className="drop-text">Glissez-déposez votre image ici</p>
          <p className="or-text">ou</p>
          <div className="upload-button">
            Choisir un fichier depuis votre appareil
          </div>
        </div>
      )}

      {/* Aperçu + boutons */}
      {preview && !analyzing && !result && (
        <div className="preview-box">
          <img src={preview} alt="Aperçu" className="preview-image" />
          <div className="button-group">
            <button className="cancel-button" onClick={handleCancel}>
              <GrUndo
                size={20}
                style={{ marginBottom: ".2em", marginRight: ".5em" }}
              />
              Annuler
            </button>
            <button className="confirm-button" onClick={handleConfirm}>
              <LuScanSearch
                size={20}
                style={{ marginBottom: ".2em", marginRight: ".5em" }}
              />
              Lancer l’analyse
            </button>
          </div>
        </div>
      )}

      {/* Spinner */}
      {analyzing && (
        <div className="analyzing-box">
          <h2 className="upload-title">Analyse en cours...</h2>
          <PiSpinnerGap size={72} className="spinner-icon" />
        </div>
      )}

      {/* Résultat */}
      {result && !analyzing && (
        <div className="result-box">
          <h2 className="upload-title">Analyse terminée</h2>
          <img src={preview} alt="Analyse" className="result-image" />
          <h3
            className="risk-title"
            style={{ color: result.result === "malignant" ? "darkred" : "darkgreen" }}
          >
            {result.result === "malignant"
              ? "Potentiellement maligne"
              : "Bénigne"}{" "}
            – Confiance : {Math.round(result.confidence * 100)}%
          </h3>
          {/* … autres détails éventuels … */}
          <button className="cancel-button" onClick={handleCancel}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
