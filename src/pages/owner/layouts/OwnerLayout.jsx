import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import { 
  LayoutDashboard,
  Users, 
  BarChart3
} from 'lucide-react';

export default function OwnerLayout() {
  // Daftar menu khusus owner yang diteruskan ke Sidebar
  const ownerMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/owner/dashboard' },
    { name: 'Laporan', icon: BarChart3, path: '/owner/laporan/penjualan' },
    { name: 'User', icon: Users, path: '/owner/users' },
  ];

  return (
    <div className="flex h-screen bg-[#F5EFEA] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar Reusable dengan menuItems khusus owner & brandName */}
      <Sidebar menuItems={ownerMenuItems} brandName="Harafina (Owner)" />

      {/* Area Konten Utama Dinamis (Outlet untuk Nested Routes) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8 bg-[#FAF8F5] w-full">
        <Outlet />
      </main>
    </div>
  );
}