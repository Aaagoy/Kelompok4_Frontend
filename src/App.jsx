import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Halaman Publik & Auth
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Halaman Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ReportManagement from './pages/admin/ReportManagement';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/kategori" element={<CategoryManagement />} />
        </Route>

        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route path="/laporan" element={<ReportManagement />} />
        </Route>
        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}