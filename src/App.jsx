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
import SupplierManagement from './pages/admin/SupplierManagement';
import OfflineOrders from './pages/admin/OfflineOrders';
import ReportManagement from './pages/admin/ReportManagement';
import PurchaseReport from './pages/admin/PurchaseReport';
import FinancialReport from './pages/admin/FinancialReport';
import PurchaseTransaction from './pages/admin/PurchaseTransaction';

// Layout & Halaman Owner (Sesuai struktur folder Anda)
import OwnerLayout from "./pages/owner/layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerReportManagement from './pages/owner/OwnerReportManagement';
import OwnerPurchaseReport from './pages/owner/OwnerPurchaseReport';
import OwnerUserManagement from "./pages/owner/OwnerUserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik & Autentikasi */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Terproteksi Khusus Admin Operasional */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/kategori" element={<CategoryManagement />} />
          <Route path="/supplier" element={<SupplierManagement />} />
          <Route path="/offlineorders" element={<OfflineOrders />} />

          {/* Rute Sub-menu Transaksi untuk Admin */}
          <Route path="/transaksi/penjualan" element={<OfflineOrders />} />
          <Route path="/transaksi/pembelian" element={<PurchaseTransaction />} />
          <Route path="/transaksi" element={<Navigate to="/transaksi/penjualan" replace />} />
          
          {/* Rute Sub-menu Laporan untuk Admin */}
          <Route path="/laporan/penjualan" element={<ReportManagement />} />
          <Route path="/laporan/pembelian" element={<PurchaseReport />} />
          <Route path="/laporan/keuangan" element={<FinancialReport />} />
          <Route path="/laporan" element={<Navigate to="/laporan/penjualan" replace />} />
        </Route>

        {/* RUTE TERPROTEKSI KHUSUS OWNER (Menggunakan OwnerLayout & Outlet) */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route element={<OwnerLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/users" element={<OwnerUserManagement />} />
            <Route path="/owner/laporan/penjualan" element={<OwnerReportManagement />} />
            <Route path="/owner/laporan/pembelian" element={<OwnerPurchaseReport />} />
            <Route path="/owner/laporan" element={<Navigate to="/owner/laporan/penjualan" replace />} />
          </Route>
        </Route>

        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}