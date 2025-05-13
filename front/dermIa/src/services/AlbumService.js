import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

export async function getUsersAlbums() {
  const res = await axios.get(`${API_BASE_URL}/album`, {
    withCredentials: true,
  });

  console.log(res.data)
  return res.data.data;
}

export const createAlbum = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/album`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true
    });
    return response.data;
};