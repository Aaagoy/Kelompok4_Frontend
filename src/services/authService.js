import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ambil semua user
export const getUser = async () => {
  const response = await API.get("/api/auth/");
  return response.data;
};

// Tambah user / Register
export const createUser = async (userData) => {
  const response = await API.post("/api/auth/register", userData);
  return response.data;
};

// Edit / Update user (Sesuaikan dengan /api/auth/account/:id)
export const updateUser = async (id, userData) => {
  const response = await API.patch(`/api/auth/account/${id}`, userData);
  return response.data;
};

// Hapus user (Sesuaikan dengan /api/auth/account/:id)
export const deleteUser = async (id) => {
  const response = await API.delete(`/api/auth/account/${id}`);
  return response.data;
};
