import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer pt-4">
            <div className="container-fluid">
                <div className="row">

                    {/* Logo */}
                    <div className="col-md-3 mb-3">
                        <h5>DermIA Logo</h5>
                    </div>

                    {/* CGU */}
                    <div className="col-md-3 mb-3 text-start">
                        <ul className="list-unstyled">
                            <li><Link to="/cgu" className="footer-link">CGU</Link></li>
                            <li><Link to="/confidentialite" className="footer-link">Politique de confidentialité</Link></li>
                        </ul>
                    </div>

                    {/* Créateurs 1 */}
                    <div className="col-md-3 mb-3 text-start">
                        <ul className="list-unstyled">
                            <li className="footer-names">BAKHAT Ghita</li>
                            <li className="footer-names">CARVAJAL Mateo</li>
							<li className="footer-names">DUGAST Eleonore</li>
							<li className="footer-names">FORERO Santiago</li>
                        </ul>
                    </div>

                    {/* Créateurs 2 */}
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
                    © {new Date().getFullYear()} DermIA. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}