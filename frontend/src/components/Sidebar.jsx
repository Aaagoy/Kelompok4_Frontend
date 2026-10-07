<<<<<<< HEAD
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Package,
  Grid,
  Calculator,
  History,
  Users,
} from "lucide-react";
=======
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
>>>>>>> 771f5ea50225c17eca4ab6dadca461d43690546a

// Tambahkan parameter { menuItems, brandName } pada props
const Sidebar = ({ menuItems = [], brandName = "Harafina" }) => {
  const location = useLocation();

<<<<<<< HEAD
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", path: "/admin/transaksi", icon: FileText },
    { name: "Produk", path: "/admin/produk", icon: Package },
    { name: "Kategori", path: "/admin/kategori", icon: Grid },
    { name: "Kasir", path: "/admin/kasir", icon: Calculator },
    { name: "Riwayat", path: "/admin/riwayat", icon: History },
    { name: "User", path: "/admin/user", icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#3E2723] text-amber-100/70 min-h-screen flex flex-col p-4 shadow-xl">
      {/* Brand Logo */}
      <div className="flex flex-col items-center py-6 mb-4 border-b border-white/10">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border-2 border-amber-200/20 p-2 flex items-center justify-center shadow-inner mb-2">
          <div className="text-center">
            <span className="text-xl">🧑‍🍳</span>
            <p className="text-[10px] font-bold text-[#3E2723] uppercase tracking-tighter leading-none mt-1">
              Harafina
            </p>
=======
  return (
    <aside className="w-64 bg-[#3E2723] text-amber-100/70 h-screen flex flex-col justify-between p-4 shadow-xl shrink-0">
      <div>
        {/* Brand Logo Dinamis */}
        <div className="flex flex-col items-center py-6 mb-4 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-[#EBE3D5] flex flex-col items-center justify-center p-2 shadow-inner border border-amber-200/20 text-center">
            <span className="font-serif font-bold text-[#3E2723] text-sm leading-none">{brandName}</span>
            <span className="text-[7px] text-[#5C3D2E] tracking-tighter mt-1 font-medium">Bahan Kue & Dapur</span>
>>>>>>> 771f5ea50225c17eca4ab6dadca461d43690546a
          </div>
        </div>

        {/* Navigasi Dinamis berdasarkan props */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#8D5B28] text-white shadow-md font-semibold'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

<<<<<<< HEAD
      {/* Navigasi */}
      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#8D5B28] text-white shadow-md font-semibold"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
=======
      {/* Profile Footer */}
      <div className="flex items-center gap-3 px-3 py-2 bg-black/20 rounded-xl mt-auto">
        <div className="w-8 h-8 rounded-full bg-[#2C1A17] text-white flex items-center justify-center text-xs font-bold shadow-inner">
          N
        </div>
      </div>
>>>>>>> 771f5ea50225c17eca4ab6dadca461d43690546a
    </aside>
  );
};

export default Sidebar;
