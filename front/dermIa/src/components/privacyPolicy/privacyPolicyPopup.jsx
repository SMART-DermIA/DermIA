import React from "react";
import { useTranslation } from "react-i18next";
import "./privacyPolicyPopup.css";

const PrivacyPolicyPopup = ({ closePopup }) => {
  const { t } = useTranslation();

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-popup" onClick={closePopup}>
          &times;
        </button>
        <h2>{t("privacyPolicy.title")}</h2>
        <div className="privacy-content">
          <p>{t("privacyPolicy.intro")}</p>
          <h3>{t("privacyPolicy.section1Title")}</h3>
          <p>{t("privacyPolicy.section1Content")}</p>
          <h3>{t("privacyPolicy.section2Title")}</h3>
          <p>{t("privacyPolicy.section2Content")}</p>
          <h3>{t("privacyPolicy.section3Title")}</h3>
          <p>{t("privacyPolicy.section3Content")}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPopup;