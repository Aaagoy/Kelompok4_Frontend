import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
// Halaman Publik & Auth
import Home from "./pages/Home";
import Login from "./pages/Login";
// Halaman Admin
<<<<<<< HEAD
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement"; // Import komponen UserManagement
=======
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement'; // Import komponen UserManagement
import ProductManagement from './pages/admin/ProductManagement';
>>>>>>> 771f5ea50225c17eca4ab6dadca461d43690546a

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/produk" element={<ProductManagement />} />
        </Route>
        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
