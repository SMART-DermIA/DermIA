import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

export async function performAnalysis(formData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      withCredentials: true,
    });

    console.log("API replied:", res.data);

    if (res.status === 200) {
      return {
        success: true,
        status: res.status,
        analysis: res.data
      };
    } else {
      return {
        success: false,
        status: res.status,
        message: res.data?.error || "Unexpected response status"
      };
    }
  } catch (err) {
    console.error("API error:", err);

    return {
      success: false,
      status: err.response?.status || 500,
      message: err.response?.data?.error || err.message || "Unexpected error"
    };
  }
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}