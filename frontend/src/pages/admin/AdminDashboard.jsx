<<<<<<< HEAD
// import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  LayoutDashboard, 
  Receipt, 
  Search, 
  Eye, 
  DollarSign, 
  ShoppingBag, 
  UserCheck 
=======
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout'; // Sesuaikan path folder jika berbeda
import {
  LayoutDashboard,
  Receipt,
  Search,
  Eye,
  DollarSign,
  ShoppingBag,
  UserCheck
>>>>>>> 771f5ea50225c17eca4ab6dadca461d43690546a
} from 'lucide-react';

export default function AdminDashboard() {
  const transactions = [
    { id: 'TRX-20251003-001', date: '03/10/2025 09:15', customer: 'Pelanggan Umum', total: 'Rp 128.000', method: 'Tunai', status: 'Selesai' },
    { id: 'TRX-20251003-002', date: '03/10/2025 10:32', customer: 'Andi Saputra', total: 'Rp 75.000', method: 'QRIS', status: 'Selesai' },
    { id: 'TRX-20251003-003', date: '03/10/2025 11:05', customer: 'Siti Nurhaliza', total: 'Rp 164.000', method: 'Tunai', status: 'Selesai' },
  ];

  return (
    <DashboardLayout>
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#8D5B3A] mb-1">
          <LayoutDashboard size={20} />
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        <p className="text-xs text-gray-400">Ringkasan aktivitas penjualan hari ini</p>
      </div>

      {/* Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-emerald-800">Total Penjualan</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 mb-2">Rp 1.234.567.890</p>
          <p className="text-[11px] text-emerald-600 font-medium"><span className="font-bold">↑ 12%</span> dari kemarin</p>
        </div>

        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-800">Total Transaksi</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Receipt size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">456</p>
          <p className="text-[11px] text-blue-600 font-medium"><span className="font-bold">↑ 8%</span> dari kemarin</p>
        </div>

        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-purple-800">Total Produk</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">120</p>
          <p className="text-[11px] text-purple-600 font-medium"><span className="font-bold">↑ 5%</span> dari kemarin</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-amber-800">Total Pelanggan</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">320</p>
          <p className="text-[11px] text-amber-600 font-medium"><span className="font-bold">↑ 7%</span> dari kemarin</p>
        </div>
      </div>

      {/* Tabel Penjualan Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#8D5B3A]" size={18} />
            <h3 className="font-bold text-gray-800 text-sm">Transaksi Penjualan Terbaru</h3>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="pl-8 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl w-60 focus:outline-none focus:border-[#8D5B3A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EFEA] text-gray-600 font-bold uppercase">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">ID Transaksi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Total Belanja</th>
                <th className="py-3.5 px-4">Metode Pembayaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {transactions.map((trx, index) => (
                <tr key={trx.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-medium text-gray-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{trx.id}</td>
                  <td className="py-3.5 px-4 text-gray-400">{trx.date}</td>
                  <td className="py-3.5 px-4">{trx.customer}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-700">{trx.total}</td>
                  <td className="py-3.5 px-4">{trx.method}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}