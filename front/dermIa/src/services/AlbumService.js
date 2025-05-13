import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

export async function getUsersAlbums() {
  const res = await axios.get(`${API_BASE_URL}/album`, {
    withCredentials: true,
  });

  console.log(res.data)
  return res.data.data;
}

export async function getAlbum(id) {
  const res = await axios.get(`${API_BASE_URL}/album/${id}`, {
    withCredentials: true,
  });

  console.log(res.data)
  return res.data.data;
}

export async function createAlbum(formData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/album/new`, formData, {
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