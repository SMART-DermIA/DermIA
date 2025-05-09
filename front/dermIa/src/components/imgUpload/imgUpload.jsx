import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import "./imgUpload.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { PiSpinnerGap } from "react-icons/pi";
import { LuScanSearch } from "react-icons/lu";
import { GrUndo } from "react-icons/gr";

export default function ImageUpload() {
    const { t } = useTranslation();
    const [upload, setUpload] = useState(true);
    const [preview, setPreview] = useState(false);
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
  // Etats
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file));
        setPreview(true);
        setUpload(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");
  // URL de l'API
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";
  console.log("ENV VAR API_BASE_URL =", API_BASE_URL);

    }, []);
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
      const data = await response.json();

    const handleCancel = () => {
        setPreview(false);
        setAnalyzing(false);
        setResult(false);
        setUpload(true);
        setImage(null);
    };	
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

    return (
        <div className="upload-container">
            {upload || preview ? (
                <div>
                    <h2 className="upload-title">{t("imgUpload.title")}</h2>
                    <p className="upload-subtitle">
                        {t("imgUpload.subtitle")}
                    </p>
                </div>
            ) : null}
  const handleCancel = () => {
    setFile(null);
    setPreview(false);
    setAnalyzing(false);
    setResult(null);
  };

            {upload ? (
                <div {...getRootProps()} className={`upload-box ${isDragActive ? "drag-active" : ""}`}>
                <input {...getInputProps()} />
                <img src="/iconUpload.png" className="img" />
                <p className="drop-text">{t("imgUpload.dropText")}</p>
                <p className="or-text">{t("imgUpload.orText")}</p>
                <div className="upload-button">{t("imgUpload.chooseFile")}</div>
            </div>
            ) : null}
            
            {preview ? (
                <div className="preview-box">
                    {!result ? (
                        <div><img src={image} alt="Aperçu" className="preview-image" />
                            <div className="button-group">
                                <button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t("imgUpload.cancel")}
                                </button>
                                <button className="confirm-button" onClick={handleConfirmTemp}>
                                    <LuScanSearch size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t("imgUpload.analyze")}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {analyzing ? (
                <div className="analyzing-box">
                    <h2 className="upload-title">{t("imgUpload.analyzing")}</h2>
                    <PiSpinnerGap size={72} className="spinner-icon" />
                </div>
            ) : null}

            {result ? (
                <div className="result-box">
                    <h2 className="upload-title">{t("imgUpload.analysisComplete")}</h2>
                    <img src={image} alt="Analyse" className="result-image" />
                
                    <h3 className="risk-title" style={{ color: "darkgreen", marginTop: "1em" }}>
                    {t("imgUpload.riskRate")}: 15%
                    </h3>
                
                    {/* Barre de risque */}
                    <div className="risk-bar-container">
                    <div className="risk-bar">
                        <div className="risk-indicator" style={{ left: "15%" }} />
                    </div>
                    <p className="risk-message">
                        {t("imgUpload.noAnomaly")}
                    </p>
                    </div>
                
                    {/* Détails d’analyse */}
                    <div className="criteria-grid">
                    <div><span style={{ color: "#660033" }}>{t("imgUpload.irregularity")}</span> <span>30%</span></div>
                    <div><span style={{ color: "#660033" }}>{t("imgUpload.asymmetry")}</span> <span>50%</span></div>
                    <div><span style={{ color: "#660033" }}>{t("imgUpload.size")}</span> <span>20%</span></div>
                    <div><span style={{ color: "#660033" }}>{t("imgUpload.color")}</span> <span>10%</span></div>
                    </div>
                
                    <a href="https://www.msdmanuals.com/fr/accueil/troubles-cutanés/excroissances-cutanées-bénignes/grains-de-beauté#Diagnostic_v28368748_fr" className="more-info-link">{t("imgUpload.learnMore")}</a>
                    <div className="button-group">
                                <button className="cancel-button" onClick={handleCancel}>
                                    <GrUndo size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t("imgUpload.cancel")}
                                </button>
                                <button className="confirm-button" onClick={handleConfirmTemp}>
                                    <BiPhotoAlbum size={20} style={{ marginBottom: '.2em', marginRight: '.5em' }} />
                                    {t("imgUpload.addToAlbum")}
                                </button>
                            </div>
                </div>
            ) : null}
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
