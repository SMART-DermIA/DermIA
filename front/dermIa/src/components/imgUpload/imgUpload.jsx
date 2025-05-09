// src/components/imgUpload/ImageUpload.jsx
import React, { useState, useCallback } from "react";
import { useDropzone }       from "react-dropzone";
import { LuScanSearch }      from "react-icons/lu";
import { PiSpinnerGap }      from "react-icons/pi";
import { GrUndo }            from "react-icons/gr";
import "./imgUpload.css";

export default function ImageUpload() {
  const [file, setFile]             = useState(null);    // Le File JS
  const [previewUrl, setPreviewUrl] = useState(null);    // URL.createObjectURL(file)
  const [analyzing, setAnalyzing]   = useState(false);   // Spinner en cours
  const [result, setResult]         = useState(null);    // { result, confidence }

  // Prend la variable .env VITE_API_URL ou en fallback localhost:8000
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log("API_BASE_URL =", API_BASE_URL);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const dropped = acceptedFiles[0];
    setFile(dropped);
    setPreviewUrl(URL.createObjectURL(dropped));
    setResult(null);
    setAnalyzing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  // ─── Appel API réel 
  const handleConfirm = async () => {
    if (!file) {
      console.error("Aucune image sélectionnée");
      return;
    }

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method:  "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Analyse OK :", data);
        setResult(data);
      } else {
        console.error("Erreur API :", data.error || res.statusText);
        alert(data.error || "Erreur d'analyse");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Erreur réseau ou serveur");
    } finally {
      setAnalyzing(false);
    }
  };

  // ─── Simulateur temporaire (optionnel) 
  const handleConfirmTemp = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({ result: "benign", confidence: 0.85 });
    }, 1500);
  };

  // ─── Réinitialiser 
  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalyzing(false);
    setResult(null);
  };

  // ─── JSX 
  return (
    <div className="upload-container">
      {/* 1. Instructions + zone de drop */}
      {!previewUrl && !analyzing && !result && (
        <>
          <h2 className="upload-title">
            Téléchargez votre image pour commencer l’analyse
          </h2>
          <p className="upload-subtitle">
            Notre IA analyse votre photo pour détecter d’éventuelles anomalies.{" "}
            <br />
            Aucune donnée n’est stockée sans votre accord.
          </p>
          <div
            {...getRootProps()}
            className={`upload-box ${isDragActive ? "drag-active" : ""}`}
          >
            <input {...getInputProps()} />
            <img src="/iconUpload.png" className="img" alt="Upload icon" />
            <p className="drop-text">Glissez-déposez votre image ici</p>
            <p className="or-text">ou</p>
            <div className="upload-button">
              Choisir un fichier depuis votre appareil
            </div>
          </div>
        </>
      )}

      {/* 2. Aperçu + boutons */}
      {previewUrl && !analyzing && !result && (
        <div className="preview-box">
          <img src={previewUrl} alt="Aperçu" className="preview-image" />
          <div className="button-group">
            <button className="cancel-button" onClick={handleCancel}>
              <GrUndo
                size={20}
                style={{ marginBottom: ".2em", marginRight: ".5em" }}
              />
              Annuler
            </button>
            <button
              className="confirm-button"
              onClick={handleConfirm /* ou handleConfirmTemp */}
            >
              <LuScanSearch
                size={20}
                style={{ marginBottom: ".2em", marginRight: ".5em" }}
              />
              Lancer l’analyse
            </button>
          </div>
        </div>
      )}

      {/* 3. Spinner pendant analyse */}
      {analyzing && (
        <div className="analyzing-box">
          <h2 className="upload-title">Analyse en cours...</h2>
          <PiSpinnerGap size={72} className="spinner-icon" />
        </div>
      )}

      {/* 4. Résultats */}
      {result && !analyzing && (
        <div className="result-box">
          <h2 className="upload-title">Analyse terminée</h2>
          <img src={previewUrl} alt="Analyse" className="result-image" />
          <h3
            className="risk-title"
            style={{
              color: result.result === "malignant" ? "darkred" : "darkgreen",
            }}
          >
            {result.result === "malignant"
              ? "Potentiellement maligne"
              : "Bénigne"}{" "}
            – Confiance : {Math.round(result.confidence * 100)}%
          </h3>

          {/* Recommencer */}
          <button className="cancel-button" onClick={handleCancel}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
