import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import { 
  LayoutDashboard,
  Package, 
  Tags, 
  Users, 
  Truck,
  BarChart3,
  ShoppingBag
} from 'lucide-react';

export default function AdminLayout() {
  // Daftar menu admin yang diteruskan ke Sidebar
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
    <div className="flex h-screen bg-[#F5EFEA] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar Reusable dengan menuItems & brandName */}
      <Sidebar menuItems={adminMenuItems} brandName="Harafina" />

      {/* Area Konten Utama Dinamis (Ditambahkan pl-16 untuk ruang tombol burger di mobile) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8 bg-[#FAF8F5] w-full">
        <Outlet />
      </main>
    </div>
  );
}