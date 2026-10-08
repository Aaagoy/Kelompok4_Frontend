import api from "./api";

export async function getProduk() {
  const resp = await api.get("/produk");
  return resp.data;
}
export async function getProdukById(id) {
  const resp = await api.get(`/produk/${id}`);
  return resp.data;
}
export async function createProduk(data) {
  const resp = await api.post("/produk", data);
  return resp.data;
}
export async function updateProduk(id, data) {
  const resp = await api.patch(`/produk/${id}`, data);
  return resp.data;
}
export async function deleteProduk(id) {
  const resp = await api.delete(`/produk/${id}`);
  return resp.data;
}
