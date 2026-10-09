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
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Pesanan Offline', icon: ShoppingBag, path: '/offlineorders' },
    { name: 'Produk', icon: Package, path: '/produk' },
    { name: 'Kategori', icon: Tags, path: '/kategori' },
    { name: 'Supplier', icon: Truck, path: '/supplier' },
    { name: 'Laporan', icon: BarChart3, path: '/laporan' },
    { name: 'User', icon: Users, path: '/users' },
  ];

  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-[#F5EFEA] font-sans">
      {/* Memanggil Komponen Sidebar secara Reusable */}
=======
    <div className="flex h-screen bg-[#F5EFEA] font-sans overflow-hidden">
      
      {/* Sidebar (Sudah responsif dengan drawer & overlay mobile) */}
>>>>>>> c7c6171bce66e69494213f34ca65e12163a19192
      <Sidebar menuItems={adminMenuItems} brandName="Harafina" />

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* Header Top Bar - Ditambahkan padding kiri (pl-16) khusus di mobile agar tidak menabrak tombol burger */}
        <header className="bg-white border-b border-[#EBE3D5] px-4 md:px-8 py-4 flex items-center justify-between shadow-sm shrink-0 pl-16 md:pl-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EBE3D5] text-[#3E2723] rounded-xl hidden sm:flex">
              <Store size={22} />
            </div>
            <div>
<<<<<<< HEAD
              <h1 className="text-lg font-bold text-[#3E2723] leading-none">
                Harafina
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                "Toko Bahan Kue dan Dapur"
              </p>
=======
              <h1 className="text-base md:text-lg font-bold text-[#3E2723] leading-none">Harafina</h1>
              <p className="text-[11px] md:text-xs text-gray-400 mt-1">"Toko Bahan Kue dan Dapur"</p>
>>>>>>> c7c6171bce66e69494213f34ca65e12163a19192
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#F8F6F0] border border-[#EBE3D5] px-3 py-1.5 rounded-full text-xs text-gray-700">
              <div className="w-6 h-6 rounded-full bg-[#3E2723] text-amber-100 flex items-center justify-center font-semibold text-xs shadow-inner">
                N
              </div>
              <span className="font-medium">Admin</span>
            </div>

<<<<<<< HEAD
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-[#8D5B28] hover:bg-[#724820] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
=======
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-[#8D5B28] hover:bg-[#724820] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
>>>>>>> c7c6171bce66e69494213f34ca65e12163a19192
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAF8F5]">
          {children}
        </main>
      </div>
    </div>
  );
}