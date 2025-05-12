import React from "react";
import { useTranslation } from "react-i18next";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer pt-4">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 mb-3 text-center">
            <Link to="/" className="navbar-brand">
              <img src="/logo.png" alt="DermIA Logo" style={{ height: "150px" }} />
            </Link>
          </div>
          <div className="col-md-3 mb-3 text-start">
            <ul className="list-unstyled">
              <li><Link to="/cgu" className="footer-link">{t("footer.cgu")}</Link></li>
              <li><Link to="/confidentialite" className="footer-link">{t("footer.privacyPolicy")}</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3 text-start">
            <ul className="list-unstyled">
              <li className="footer-names">BAKHAT Ghita</li>
              <li className="footer-names">CARVAJAL Mateo</li>
              <li className="footer-names">DUGAST Eleonore</li>
              <li className="footer-names">FORERO Santiago</li>
            </ul>
          </div>
          <div className="col-md-3 mb-3 text-start">
            <ul className="list-unstyled">
              <li className="footer-names">NAIBO Morgane</li>
              <li className="footer-names">SAUCE Marc</li>
              <li className="footer-names">SOUTHERLAND José</li>
              <li className="footer-names">WILSON Chris</li>
            </ul>
          </div>
        </div>
        <div className="text-start py-3 border-top mt-3">
          © {new Date().getFullYear()} Derm'IA. {t("footer.rightsReserved")}
        </div>
      </div>
    </footer>
  );
}