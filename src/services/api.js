import axios from "axios";

// 1. Ekspor API_URL agar bisa di-import oleh Home.jsx atau komponen lain
export const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 2. Membuat instance Axios dengan base URL
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan token JWT secara otomatis pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
