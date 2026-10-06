<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Komponen Proteksi
import ProtectedRoute from './components/ProtectedRoute';

// Halaman Publik & Auth
import Home from './pages/Home';
import Login from './pages/Login';

// Halaman Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement'; // Import komponen UserManagement

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rute Terproteksi Khusus Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

        {/* Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
>>>>>>> e9db3fcb32627212c110680e8d37738a1887b270
