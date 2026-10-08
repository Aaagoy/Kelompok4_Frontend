import api from "./api";

export async function getKategori() {
  const resp = await api.get("/kategori");
  return resp.data;
}
export async function getKategoriById(id) {
  const resp = await api.get(`/kategori/${id}`);
  return resp.data;
}
export async function createKategori(data) {
  const resp = await api.post("/kategori", data);
  return resp.data;
}
export async function updateKategori(id, data) {
  const resp = await api.patch(`/kategori/${id}`, data);
  return resp.data;
}
export async function deleteKategori(id) {
  const resp = await api.delete(`/kategori/${id}`);
  return resp.data;
}
