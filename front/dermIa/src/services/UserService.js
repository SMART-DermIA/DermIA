import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Inscription d'un nouvel utilisateur
export async function registerUser(formData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: formData.email,
      password: formData.password,
      nom: formData.nom,
      prenom: formData.prenom,
      doctor_name: formData.doctor_name || undefined,
      doctor_phone: formData.doctor_phone || undefined,
      doctor_email: formData.doctor_email || undefined,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 201) {
      return {
        success: false,
        status: res.status,
        message: res.data?.error || "Registration failed"
      };
    }

    return { success: true, status: 201 };

  } catch (err) {
    if (err.response) {
      return {
        success: false,
        status: err.response.status,
        message: err.response.data?.error || "Server error during registration"
      };
    } else if (err.request) {
      return {
        success: false,
        status: 503,
        message: "No response from server"
      };
    } else {
      return {
        success: false,
        status: 500,
        message: "Unexpected error during registration"
      };
    }
  }
}

// Soumission ou mise à jour des infos médecin
export async function submitDoctorInfo(mode, formData) {
  const endpoint = mode === "add" ? "add_medecin" : "update_medecin";
  const method = mode === "add" ? "POST" : "PUT";

  try {
    const res = await axios({
      method,
      url: `${API_BASE_URL}/user/${endpoint}`,
      data: {
        doctor_name: formData.name,
        doctor_phone: formData.phone,
        doctor_email: formData.email,
      },
      withCredentials: true,
    });

    return { success: true, data: res.data };

  } catch (err) {
    if (err.response) {
      return {
        success: false,
        message: err.response.data?.error || "Erreur serveur"
      };
    } else {
      return {
        success: false,
        message: "Erreur réseau ou serveur"
      };
    }
  }
}