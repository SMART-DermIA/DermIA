import React, { useState } from "react";
import Navbar from "../components/navBar/navbar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,   // envoie l'email comme username pour l'instant
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Token reçu :", data.access_token);
                setSuccess("Connexion réussie !");
                // Option bonus : sauvegarder le token pour la session
                localStorage.setItem("token", data.access_token);
            } else {
                setError(data.error || "Erreur de connexion.");
            }
        } catch (err) {
            console.error("Erreur réseau ou serveur :", err);
            setError("Erreur réseau ou serveur.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login-container">
                <h1 className="login-title">Connexion</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez votre email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Se connecter
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;