import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./settings.css";
import Navbar from "../components/navBar/navbar";
import { useAuth } from "../AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");
  const { user, logout } = useAuth();

  // État pour le médecin traitant
  const [medecin, setMedecin] = useState(null);
  const [showMedecinForm, setShowMedecinForm] = useState(false);
  const [medecinFormMode, setMedecinFormMode] = useState("add"); // 'add' ou 'edit'
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
  });

  // Charger les infos du médecin existant au montage
  useEffect(() => {
    const fetchMedecin = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${API_BASE_URL}/user/medecin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          setMedecin(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMedecin();
  });

  // Handlers Médecin
  const handleEditMedecin = () => {
    setFormData({
      nom: medecin.nom,
      telephone: medecin.telephone,
      email: medecin.email,
    });
    setMedecinFormMode("edit");
    setShowMedecinForm(true);
  };

  const handleAddMedecin = () => {
    setFormData({ nom: "", telephone: "", email: "" });
    setMedecinFormMode("add");
    setShowMedecinForm(true);
  };

  const handleMedecinFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedecinFormSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      medecinFormMode === "add" ? "/user/add_medecin" : "/user/update_medecin";
    const method = medecinFormMode === "add" ? "POST" : "PUT";

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      if (resp.ok) {
        toast.success(
          `Médecin ${
            medecinFormMode === "add" ? "ajouté" : "modifié"
          } avec succès`
        );
        setMedecin(formData);
        setShowMedecinForm(false);
      } else {
        toast.error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau ou serveur");
    }
  };

  // Handler Suppression compte
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_BASE_URL}/auth/delete_account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) {
        toast.success("Compte supprimé avec succès.");
        logout();
        navigate("/");
      } else {
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau ou serveur");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="settings-page">
        <h1>Paramètres</h1>

        {/* Section médecin traitant */}
        <section className="section">
          <h2>Médecin traitant</h2>
          {medecin ? (
            <div className="medecin-info">
              <p>
                <strong>Nom :</strong> {medecin.nom}
              </p>
              <p>
                <strong>Téléphone :</strong> {medecin.telephone}
              </p>
              <p>
                <strong>Email :</strong> {medecin.email}
              </p>
              <button onClick={handleEditMedecin}>Modifier</button>
            </div>
          ) : (
            <button className="add-button" onClick={handleAddMedecin}>
              Ajouter un médecin traitant
            </button>
          )}

          {showMedecinForm && (
            <form className="medecin-form" onSubmit={handleMedecinFormSubmit}>
              <label>
                Nom
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <label>
                Téléphone
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={() => setShowMedecinForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="section">
          <h2>Mon compte</h2>
          {user && (
            <p>
              <strong>Username :</strong> {user.username}
            </p>
          )}
          <button className="danger" onClick={handleDeleteAccount}>
            Supprimer mon compte
          </button>
        </section>
      </div>
    </div>
  );
}
