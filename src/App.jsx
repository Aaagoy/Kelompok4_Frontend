import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Halaman Publik & Auth
import Home from './pages/Home';
import Login from './pages/Login';    
import AdminLogin from './pages/admin/AdminLogin';
import Register from './pages/Register';

// Halaman Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ReportManagement from './pages/admin/ReportManagement';
import PurchaseReport from './pages/admin/PurchaseReport';
import FinancialReport from './pages/admin/FinancialReport';
import SupplierManagement from './pages/admin/SupplierManagement';
import OfflineOrders from './pages/admin/OfflineOrders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik & Autentikasi */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/kategori" element={<CategoryManagement />} />
          <Route path="/supplier" element={<SupplierManagement />} />
          <Route path="/offlineorders" element={<OfflineOrders />} />
          
          {/* Rute Sub-menu Laporan untuk Admin */}
          <Route path="/laporan/penjualan" element={<ReportManagement />} />
          <Route path="/laporan/pembelian" element={<PurchaseReport />} />
          <Route path="/laporan/keuangan" element={<FinancialReport />} />
          <Route path="/laporan" element={<Navigate to="/laporan/penjualan" replace />} />
        </Route>

        {/* Rute Terproteksi Khusus Owner */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          {/* Rute Sub-menu Laporan untuk Owner */}
          <Route path="/laporan/penjualan" element={<ReportManagement />} />
          <Route path="/laporan/pembelian" element={<PurchaseReport />} />
          <Route path="/laporan" element={<Navigate to="/laporan/penjualan" replace />} />
        </Route>

        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}