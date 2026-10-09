<<<<<<< HEAD
import {
  LayoutDashboard,
  Receipt,
  Package,
  Tags,
  Calculator,
  History,
  Users,
  LogOut,
  Store,
  Truck,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Impor komponen sidebar yang terpisah
=======
import { 
  LayoutDashboard,
  Package, 
  Tags, 
  Users, 
  LogOut, 
  Store,
  Truck,
  BarChart3,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Impor komponen sidebar yang terpisah
>>>>>>> d0f2c0b44b11785c61924d1fa536482f3cf582f7

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  // Daftar menu khusus Admin
  const adminMenuItems = [
<<<<<<< HEAD
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Transaksi", icon: Receipt, path: "/transaksi" },
    { name: "Produk", icon: Package, path: "/produk" },
    { name: "Kategori", icon: Tags, path: "/kategori" },
    { name: "Supplier", icon: Truck, path: "/supplier" },
    { name: "Kasir", icon: Calculator, path: "/kasir" },
    { name: "Riwayat", icon: History, path: "/riwayat" },
    { name: "Laporan", icon: BarChart3, path: "/laporan" },
    { name: "User", icon: Users, path: "/users" },
=======
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Pesanan Offline', icon: ShoppingBag, path: '/offlineorders' },
    { name: 'Produk', icon: Package, path: '/produk' },
    { name: 'Kategori', icon: Tags, path: '/kategori' },
    { name: 'Supplier', icon: Truck, path: '/supplier' },
    { name: 'Laporan', icon: BarChart3, path: '/laporan' },
    { name: 'User', icon: Users, path: '/users' },
>>>>>>> d0f2c0b44b11785c61924d1fa536482f3cf582f7
  ];

  return (
    <div className="flex h-screen bg-[#F5EFEA] font-sans">
      {/* Memanggil Komponen Sidebar secara Reusable */}
      <Sidebar menuItems={adminMenuItems} brandName="Harafina" />

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Top Bar */}
        <header className="bg-white border-b border-[#EBE3D5] px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EBE3D5] text-[#3E2723] rounded-xl">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#3E2723] leading-none">
                Harafina
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                "Toko Bahan Kue dan Dapur"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#F8F6F0] border border-[#EBE3D5] px-3 py-1.5 rounded-full text-xs text-gray-700">
              <div className="w-6 h-6 rounded-full bg-[#3E2723] text-amber-100 flex items-center justify-center font-semibold text-xs shadow-inner">
                N
              </div>
              <span className="font-medium">Admin</span>
              <span className="text-gray-400">˅</span>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-[#8D5B28] hover:bg-[#724820] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#FAF8F5]">
          {children}
        </main>
      </div>
    </div>
  );
}
