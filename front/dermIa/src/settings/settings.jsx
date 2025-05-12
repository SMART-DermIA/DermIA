import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./settings.css";
import Navbar from "../components/navBar/navbar";
import {useAuth} from "../auth/authContext.jsx";
import axios from "axios";
import {submitDoctorInfo} from "../services/UserService.js";

export default function Settings() {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");
  const { user, logout } = useAuth();

  const [medecin, setMedecin] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [showMedecinForm, setShowMedecinForm] = useState(false);
  const [medecinFormMode, setMedecinFormMode] = useState("add"); // 'add' ou 'edit'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setMedecin({
        name: user.doctor_name || "",
        phone: user.doctor_phone || "",
        email: user.doctor_email || "",
      });
    }
  }, [user]);

  const handleEditMedecin = () => {
    setFormData({
      name: user.doctor_name,
      phone: user.doctor_phone,
      email: user.doctor_email,
    });
    setMedecinFormMode("edit");
    setShowMedecinForm(true);
  };

  const handleAddMedecin = () => {
    setFormData({ name: "", phone: "", email: "" });
    setMedecinFormMode("add");
    setShowMedecinForm(true);
  };

  const handleMedecinFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedecinFormSubmit = async (e) => {
    e.preventDefault();
    const result = await submitDoctorInfo(medecinFormMode, formData);

    if (result.success) {
      toast.success(`Médecin ${medecinFormMode === "add" ? "ajouté" : "modifié"} avec succès`);
      const doctor = result.data.doctor;
      setMedecin({
        name: doctor.name,
        phone: doctor.phone,
        email: doctor.email,
      });
      setShowMedecinForm(false);
    } else {
      toast.error(result.message || "Erreur lors de la mise à jour");
      console.error("Doctor submission failed:", result.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }
    try {
      const resp = await axios.delete(`${API_BASE_URL}/auth/delete_account`, {
        withCredentials: true,
      });

      switch (resp.status) {
        case 200:
          toast.success("Compte supprimé avec succès.");
          logout();
          break;
        case 404:
          toast.error("User not found.");
      }
    } catch (err) {
      toast.error("Erreur réseau ou serveur, see console for more details");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="settings-page">
        <h1>Paramètres</h1>

        <section className="section">
          <h2>Médecin traitant</h2>
          {medecin.name ? (
            <div className="medecin-info">
              <p>
                <strong>Nom : </strong> {medecin.name}
              </p>
              <p>
                <strong>Téléphone : </strong> {medecin.phone}
              </p>
              <p>
                <strong>Email : </strong> {medecin.email}
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
                  name="name"
                  value={formData.name}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <label>
                Téléphone
                <input
                  name="phone"
                  value={formData.phone}
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
