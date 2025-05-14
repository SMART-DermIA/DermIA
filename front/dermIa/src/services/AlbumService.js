import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin.replace(":5173", ":8000");

export async function getUsersAlbums() {
  const res = await axios.get(`${API_BASE_URL}/album`, {
    withCredentials: true,
  });

  let albums = res.data.data;

  albums = albums.map(album => ({
      id: album.id,
      title: album.title,
      date: album.date,
      analyses: album.analyses.map(analysis => ({
        id: analysis.id,
        result: analysis.result,
        date: analysis.date,
        photo: API_BASE_URL + analysis.photo
      })),
      position_label: album.position_label,
      position_x: album.position_x,
      position_y: album.position_y,
      orientation: album.orientation,

      last_updated: album.last_updated,
      last_photo: API_BASE_URL + album.last_photo
    })
  )

  console.log(albums)

  return albums;
}

export async function getAlbum(id) {
  const res = await axios.get(`${API_BASE_URL}/album/${id}`, {
    withCredentials: true,
  });

  let album = res.data.data;

  album = {
    id: album.id,
    title: album.title,
    date: album.date,
    analyses: album.analyses.map(analysis => ({
      id: analysis.id,
      result: analysis.result,
      date: analysis.date,
      photo: API_BASE_URL + analysis.photo
    })),
    position_label: album.position_label,
    position_x: album.position_x,
    position_y: album.position_y,
    orientation: album.orientation,

    oldest_analysis_date: album.oldest_analysis_date,
    newest_analysis_date: album.newest_analysis_date,
    newest_analysis_photo: API_BASE_URL + album.newest_analysis_photo
  }

  console.log(res.data)
  return album;
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