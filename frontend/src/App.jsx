import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard.jsx";
// import ProtectedRoute from "./components/ProtectedRoute";
// Halaman Publik & Auth
<<<<<<< HEAD
import Home from "./pages/Home";
import Login from "./pages/Login";
// Halaman Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement"; // Import komponen UserManagement
import ProductManagement from "./pages/admin/ProductManagement";
=======
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Halaman Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement'; // Import komponen UserManagement
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        {/* Rute Terproteksi Khusus Admin */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/produk" element={<ProductManagement />} />
        {/* </Route> */}
=======
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/kategori" element={<CategoryManagement />} />
        </Route>

>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd
        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
