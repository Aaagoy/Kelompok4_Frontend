import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Package, 
  Tags, 
  Calculator, 
  History, 
  Users, 
  LogOut, 
  Store
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transaksi', icon: Receipt, path: '/transaksi' },
    { name: 'Produk', icon: Package, path: '/produk' },
    { name: 'Kategori', icon: Tags, path: '/kategori' },
    { name: 'Kasir', icon: Calculator, path: '/kasir' },
    { name: 'Riwayat', icon: History, path: '/riwayat' },
    { name: 'User', icon: Users, path: '/users' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#3E2723] text-white flex flex-col justify-between p-4 shadow-lg shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="flex flex-col items-center justify-center py-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-full bg-[#FFF8E7] flex items-center justify-center p-2 mb-2 border-2 border-[#D7CCC8]">
              <div className="text-center">
                <span className="block font-serif text-[#3E2723] font-bold text-lg leading-tight">Harafina</span>
                <span className="text-[9px] text-[#5D4037] block">Bahan Kue & Dapur</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="mt-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#8D6E63] text-white shadow-md' 
                      : 'text-amber-100/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Inisial */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center font-bold text-sm">
            N
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">Harafina</h1>
              <p className="text-xs text-gray-400 mt-1">"Belanja Mudah, Hidup Lebih Baik"</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs text-gray-600">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                8
              </div>
              <span>Admin</span>
              <span className="text-gray-400">˅</span>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-[#FF2A4B] hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}