export async function getUsersAlbums() {
  const res = await axios.get("http://localhost:3000/album", {
    withCredentials: true,
  });
  return res.data;
}