import React, { useState } from "react";
import Navbar from "../components/navBar/navbar";
import "./userAccueil.css";
import { useAuth } from "../auth/authContext.jsx";
import { useTranslation } from "react-i18next";
import ImageInput from "../components/ImageInput/ImageInput.jsx";
import {
  performAnalysis,
  readFileAsDataURL,
} from "../services/AnalysisService.js";
import { toast } from "react-toastify";
import { GrUndo } from "react-icons/gr";
import { BiPhotoAlbum } from "react-icons/bi";
import { Link } from "react-router-dom";
import { LuScanSearch } from "react-icons/lu";
import {
  CircleXIcon,
  FullscreenIcon,
  ImageUpscaleIcon,
  InfoIcon,
  SendIcon,
  SunIcon,
  UserSearchIcon,
} from "lucide-react";

const UserAccueil = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false); // Nuevo estado

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);

      const result = await performAnalysis(formData);

      if (!result.success) {
        toast.error("Error while uploading / performing analysis");
      } else {
        toast.success("Analysis complete!");

        const file = formData.get("image");
        const base64String = await readFileAsDataURL(file);

        const received_analysis = {
          ...result.analysis,
          image: base64String,
        };
        console.log("Image as base64:", base64String);

        setAnalysis(received_analysis);
        localStorage.setItem("analysis", JSON.stringify(received_analysis));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    }
  }

  function handleCancel() {
    localStorage.removeItem("analysis");
    setAnalysis(null);
    setImageLoaded(false);
    setResetTrigger((prev) => prev + 1);
  }

  if (analysis)
    return (
      <div>
        <Navbar />
        <div className="upload-container">
          <div className="result-box">
            <h2 className="upload-title">
              {t("userAccueil.analysisComplete")}
            </h2>
            <img src={analysis.image} alt="Analyse" className="result-image" />
            <h3
              className="risk-title"
              style={{
                color: analysis.result === "malignant" ? "#d32f2f" : "#2e7d32",
                marginTop: "1.2em",
              }}
            >
              {analysis.result === "malignant"
                ? t("userAccueil.potentiallyMalignant")
                : t("userAccueil.benign")}{" "}
              – {t("userAccueil.dangerRate", { rate: analysis.danger_rate })}{" "}
              {analysis.danger_rate > 50 ? t("userAccueil.highRisk") : ""}
            </h3>

            <div className="risk-bar-container">
              <div className="risk-bar">
                <div
                  className="risk-indicator"
                  style={{ left: `${analysis.danger_rate}%` }}
                />
              </div>
              <p
                className="risk-message"
                style={{
                  color: analysis.danger_rate > 50 ? "#d32f2f" : "#2e7d32",
                }}
              >
                {analysis.danger_rate > 50
                  ? t("userAccueil.consulter")
                  : t("userAccueil.lowRisk")}
              </p>
              {analysis.danger_rate > 50 && (
                <div className="doctor-recommendation">
                  <a
                    href="https://www.doctolib.fr/dermatologue/france"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="doctor-button">
                      <UserSearchIcon
                        size={20}
                        style={{ marginBottom: ".2em", marginRight: ".5em" }}
                      />
                      {t("userAccueil.doctorButton")}
                    </button>
                  </a>
                </div>
              )}
              <a
                href="https://www.msdmanuals.com/fr/accueil/troubles-cutan%C3%A9s/excroissances-cutan%C3%A9es-b%C3%A9nignes/grains-de-beaut%C3%A9#Diagnostic_v28368748_fr"
                className="more-info-link"
                style={{ marginTop: "1.5em", display: "inline-block" }}
              >
                {t("userAccueil.moreInfo")}
              </a>
            </div>

            <div className="criteria-group">
              {[
                {
                  name: t("userAccueil.criteria.irregularity"),
                  value: analysis.scores.irregularity,
                },
                {
                  name: t("userAccueil.criteria.asymmetry"),
                  value: analysis.scores.asymmetry,
                },
                {
                  name: t("userAccueil.criteria.size"),
                  value: analysis.scores.size,
                },
                {
                  name: t("userAccueil.criteria.color"),
                  value: analysis.scores.color,
                },
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
                <SendIcon
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("userAccueil.shareDoctor")}
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                <CircleXIcon
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("userAccueil.cancel")}
              </button>
              <Link to={"/save-analysis"} className="confirm-button">
                <BiPhotoAlbum
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("userAccueil.saveAlbum")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      {user && (
        <h1 className="titre-bienvenue">
          {t("userAccueil.welcome")} {user.prenom} !{" "}
        </h1>
      )}
      <div className="upload-container">
        <h2 className="upload-title">{t("imgUpload.title")}</h2>
        <p className="upload-subtitle">
          {t("imgUpload.subtitle1")}
          <br />
          {t("imgUpload.subtitle2")}
        </p>
        <form onSubmit={handleSubmit}>
          <ImageInput
            name="image"
            id="image"
            onImageLoad={setImageLoaded}
            resetTrigger={resetTrigger}
          />
          {imageLoaded && (
            <div className="button-group">
              <button
                className="cancel-button"
                type="button"
                onClick={handleCancel}
              >
                <GrUndo
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("imgUpload.cancel")}
              </button>
              <button className="confirm-button" type="submit">
                <LuScanSearch
                  size={20}
                  style={{ marginBottom: ".2em", marginRight: ".5em" }}
                />
                {t("imgUpload.analyze")}
              </button>
            </div>
          )}
        </form>

        <section className="upload-advice">
          <h2>{t("uploadAdvice.title")}</h2>

          <span className="advice-header">
            <ImageUpscaleIcon />
            <h3>{t("uploadAdvice.resolutionTitle")}</h3>
          </span>
          <ul>
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.resolutionItem1"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.resolutionItem2"),
              }}
            />
          </ul>

          <div className="suggestion-box">
            <h4>{t("uploadAdvice.suggestionsTitle")}</h4>
            <ul>
              <li>{t("uploadAdvice.resolutionSuggest1")}</li>
              <li>{t("uploadAdvice.resolutionSuggest2")}</li>
            </ul>
          </div>

          <span className="advice-header">
            <FullscreenIcon />
            <h3>{t("uploadAdvice.framingTitle")}</h3>
          </span>
          <ul>
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.framingItem1"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.framingItem2"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.framingItem3"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.framingItem4"),
              }}
            />
          </ul>

          <div className="suggestion-box">
            <h4>{t("uploadAdvice.suggestionsTitle")}</h4>
            <ul>
              <li
                dangerouslySetInnerHTML={{
                  __html: t("uploadAdvice.framingSuggest1"),
                }}
              />
            </ul>
          </div>

          <span className="advice-header">
            <SunIcon />
            <h3>{t("uploadAdvice.lightingTitle")}</h3>
          </span>
          <ul>
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.lightingItem1"),
              }}
            />
          </ul>

          <div className="suggestion-box">
            <h4>{t("uploadAdvice.suggestionsTitle")}</h4>
            <ul>
              <li
                dangerouslySetInnerHTML={{
                  __html: t("uploadAdvice.lightingSuggest1"),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: t("uploadAdvice.lightingSuggest2"),
                }}
              />
            </ul>
          </div>

          <span className="advice-header">
            <InfoIcon />
            <h3>{t("uploadAdvice.generalTitle")}</h3>
          </span>
          <ul>
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.generalItem1"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.generalItem2"),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t("uploadAdvice.generalItem3"),
              }}
            />
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserAccueil;
