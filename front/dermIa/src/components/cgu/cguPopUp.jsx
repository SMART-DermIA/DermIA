import React from "react";
import { useTranslation } from "react-i18next";
import "./cguPopUp.css";

const CguPopUp = ({ closePopup }) => {
  const { t } = useTranslation();

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-popup" onClick={closePopup}>
          &times;
        </button>
        <h2>{t("cgu.title")}</h2>
        
        <section>
          <h3>{t("cgu.section1Title")}</h3>
          <p>{t("cgu.section1Content1")}</p>
          <p>{t("cgu.section1Content2")}</p>
        </section>

        <section>
          <h3>{t("cgu.section2Title")}</h3>
          <ul>
            <li>{t("cgu.section2Content1")}</li>
            <li>{t("cgu.section2Content2")}</li>
            <li>{t("cgu.section2Content3")}</li>
          </ul>
        </section>

        <section>
          <h3>{t("cgu.section3Title")}</h3>
          <p>{t("cgu.section3Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section4Title")}</h3>
          <p>{t("cgu.section4Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section5Title")}</h3>
          <p>{t("cgu.section5Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section6Title")}</h3>
          <p>{t("cgu.section6Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section7Title")}</h3>
          <p>{t("cgu.section7Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section8Title")}</h3>
          <p>{t("cgu.section8Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section9Title")}</h3>
          <p>{t("cgu.section9Content")}</p>
        </section>

        <section>
          <h3>{t("cgu.section10Title")}</h3>
          <p>{t("cgu.section10Content")}</p>
        </section>
      </div>
    </div>
  );
};

export default CguPopUp;