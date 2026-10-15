// import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase(); // Dinormalkan ke huruf kecil

  if (!token) {
    // Diarahkan ke /admin/login agar sesuai dengan portal staf internal
    return <Navigate to="/admin/login" replace />;
  }

  // Normalisasi allowedRoles juga ke huruf kecil untuk menghindari error kapitalisasi
  const normalizedAllowedRoles = allowedRoles ? allowedRoles.map(r => r.toLowerCase()) : [];

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    // Jika salah role, arahkan kembali ke login internal
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}