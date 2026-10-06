import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Grid, 
  Calculator, 
  History, 
  Users 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Transaksi', path: '/admin/transaksi', icon: FileText },
    { name: 'Produk', path: '/admin/produk', icon: Package },
    { name: 'Kategori', path: '/admin/kategori', icon: Grid },
    { name: 'Kasir', path: '/admin/kasir', icon: Calculator },
    { name: 'Riwayat', path: '/admin/riwayat', icon: History },
    { name: 'User', path: '/admin/user', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#3E2723] text-amber-100/70 min-h-screen flex flex-col p-4 shadow-xl">
      {/* Brand Logo */}
      <div className="flex flex-col items-center py-6 mb-4 border-b border-white/10">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border-2 border-amber-200/20 p-2 flex items-center justify-center shadow-inner mb-2">
          <div className="text-center">
            <span className="text-xl">🧑‍🍳</span>
            <p className="text-[10px] font-bold text-[#3E2723] uppercase tracking-tighter leading-none mt-1">Harafina</p>
          </div>
        </div>
      </div>

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
    </aside>
  );
};

export default Sidebar;