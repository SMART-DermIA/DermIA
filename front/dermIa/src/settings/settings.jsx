import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./settings.css";
import Navbar from "../components/navBar/navbar";
import { useAuth } from "../auth/authContext.jsx";
import axios from "axios";
import { submitDoctorInfo } from "../services/UserService.js";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    window.location.origin.replace(":5173", ":8000");
  const { user, logout } = useAuth();
  const { t } = useTranslation();

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
      toast.success(
        medecinFormMode === "add"
          ? t("toast.doctorAdded")
          : t("toast.doctorUpdated")
      );
      const doctor = result.data.doctor;
      setMedecin({
        name: doctor.name,
        phone: doctor.phone,
        email: doctor.email,
      });
      setShowMedecinForm(false);
    } else {
      toast.error(result.message || t("toast.errorUpdatingDoctor"));
      console.error("Doctor submission failed:", result.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("confirm.deleteAccount"))) {
      return;
    }
    try {
      const resp = await axios.delete(`${API_BASE_URL}/auth/delete_account`, {
        withCredentials: true,
      });

      switch (resp.status) {
        case 200:
          toast.success(t("toast.accountDeleted"));
          logout();
          break;
        case 404:
          toast.error(t("toast.userNotFound"));
      }
    } catch (err) {
      toast.error(t("toast.networkError"));
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="settings-page">
        <h1>{t("settings.title")}</h1>

        <section className="section">
          <h2>{t("settings.doctor")}</h2>
          {medecin.name ? (
            <div className="medecin-info">
              <p>
                <strong>{t("settings.name")} : </strong> {medecin.name}
              </p>
              <p>
                <strong>{t("settings.phone")} : </strong> {medecin.phone}
              </p>
              <p>
                <strong>{t("settings.email")} : </strong> {medecin.email}
              </p>
              <button onClick={handleEditMedecin}>{t("settings.edit")}</button>
            </div>
          ) : (
            <button className="add-button" onClick={handleAddMedecin}>
              {t("settings.addDoctor")}
            </button>
          )}

          {showMedecinForm && (
            <form className="medecin-form" onSubmit={handleMedecinFormSubmit}>
              <label>
                {t("settings.name")}
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <label>
                {t("settings.phone")}
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <label>
                {t("settings.email")}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleMedecinFormChange}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit">{t("settings.save")}</button>
                <button type="button" onClick={() => setShowMedecinForm(false)}>
                  {t("settings.cancel")}
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="section">
          <h2>{t("settings.account")}</h2>
          {user && (
            <p>
              <strong>{t("settings.username")} :</strong> {user.username}
            </p>
          )}
          <button className="danger" onClick={handleDeleteAccount}>
            {t("settings.deleteAccount")}
          </button>
        </section>
      </div>
    </div>
  );
}
