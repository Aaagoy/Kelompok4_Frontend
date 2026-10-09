import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
// import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar Reusable */}
      <Sidebar />

      {/* Area Konten Utama Dinamis */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}