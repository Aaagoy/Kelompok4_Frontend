import axios from "axios";

// Base URL backend Express.js kamu
const API = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor untuk menyertakan token autentikasi (jika endpoint supplier memerlukan token)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Mengambil seluruh daftar supplier untuk dropdown/pilihan di form
export const getSuppliers = async () => {
  const response = await API.get("/supplier");
  return response.data;
};

// 2. Menambah supplier baru (opsional jika dibutuhkan di menu supplier)
export const createSupplier = async (supplierData) => {
  const response = await API.post("/supplier", supplierData);
  return response.data;
};

// 3. Mengupdate supplier berdasarkan ID
export const updateSupplier = async (id, supplierData) => {
  const response = await API.put(`/supplier/${id}`, supplierData);
  return response.data;
};

// 4. Menghapus supplier berdasarkan ID
export const deleteSupplier = async (id) => {
  const response = await API.delete(`/supplier/${id}`);
  return response.data;
};
