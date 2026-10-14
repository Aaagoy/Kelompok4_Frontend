import axios from "axios";

// Base URL backend Express.js kamu (sama seperti authService)
const API = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor untuk menyertakan token autentikasi (jika endpoint expense dilindungi middleware)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Mengambil seluruh data transaksi pembelian / restock (beserta data supplier)
export const getExpenses = async () => {
  const response = await API.get("/expense");
  return response.data;
};

// 2. Mengambil detail transaksi berdasarkan ID
export const getExpenseById = async (id) => {
  const response = await API.get(`/expense/${id}`);
  return response.data;
};

// 3. Mencatat transaksi pembelian / restock baru
export const createExpense = async (expenseData) => {
  const response = await API.post("/expense", expenseData);
  return response.data;
};

// 4. Menghapus transaksi pembelian
export const deleteExpense = async (id) => {
  const response = await API.delete(`/expense/${id}`);
  return response.data;
};
