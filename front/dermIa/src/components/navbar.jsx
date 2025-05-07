import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
	const [language, setLanguage] = useState("FR");

	const handleLanguageChange = (lang) => {
		setLanguage(lang);
	};

	return (
		<nav className="navbar navbar-expand-lg">
			<div className="container-fluid d-flex justify-content-between">
			<Link to="/" className="navbar-brand">
				<img src="/logo.png" alt="DermIA Logo" style={{ height: "100px" }} />
			</Link>
				<button 
					className="navbar-toggler custom-toggler" 
					type="button" 
					data-bs-toggle="collapse" 
					data-bs-target="#navbarNav" 
					aria-controls="navbarNav" 
					aria-expanded="false" 
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							<Link
								to="/login"
								className="nav-link nav-link-primary"
								>
									Se connecter
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/register"
								className="nav-link nav-link-secondary"
								>
									S'inscrire
							</Link>
						</li>
					</ul>
					<div className="d-flex align-items-center">
						<span
							className={`nav-lang ${language === "FR" ? "active" : ""}`}
							onClick={() => handleLanguageChange("FR")}
						>
							FR
						</span>
						<span>/</span>
						<span
							className={`nav-lang ${language === "EN" ? "active" : ""}`}
							onClick={() => handleLanguageChange("EN")}
						>
							EN
						</span>
					</div>
				</div>
			</div>
		</nav>
		
	);
}