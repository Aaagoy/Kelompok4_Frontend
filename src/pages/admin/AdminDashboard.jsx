import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  LayoutDashboard,
  Receipt,
  Search,
  Eye,
  ShoppingBag,
  Globe,
  Store,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products_data");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [offlineOrders, setOfflineOrders] = useState(() => {
    const savedOfflineOrders = localStorage.getItem("offline_orders_data");
    return savedOfflineOrders ? JSON.parse(savedOfflineOrders) : [];
  });

  // Sinkronisasi otomatis dari localStorage secara real-time
  useEffect(() => {
    const loadData = () => {
      const savedProducts = localStorage.getItem("products_data");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      const savedOfflineOrders = localStorage.getItem("offline_orders_data");
      if (savedOfflineOrders) {
        setOfflineOrders(JSON.parse(savedOfflineOrders));
      }
    };

    loadData();

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const checkExpiryStatus = (dateString) => {
    if (!dateString) return { status: 'safe', label: 'Tidak ada info' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateString);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'Kadaluarsa!' };
    } else if (diffDays <= 30) {
      return { status: 'warning', label: `Segera Exp (${diffDays} hari)` };
    } else {
      return { status: 'safe', label: 'Aman' };
    }
  };

  const totalProduk = products.length;

  // DIPERBAIKI: Disamakan dengan aturan ProductManagement (Stok > 0 dan <= 10 atau berstatus Stok Menipis)
  const stokKritis = products.filter((p) => {
    const isWithdrawn = p.manualStatus === 'Produk Ditarik';
    const currentStatus = p.manualStatus || (Number(p.stok) > 10 ? "Tersedia" : Number(p.stok) > 0 ? "Stok Menipis" : "Habis");
    return !isWithdrawn && (currentStatus === "Stok Menipis" || currentStatus === "Habis" || Number(p.stok) <= 10);
  });
  
  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const { status } = checkExpiryStatus(p.expiryDate);
    return status === 'expired' || status === 'warning';
  });

  const totalOfflineSelesai = offlineOrders.filter((o) => o.status === "Selesai").length;

  const [searchTerm, setSearchTerm] = useState("");
  
  const transactions = [
    ...offlineOrders.map((o) => ({
      id: o.id,
      date: o.date,
      type: "Offline",
      customer: o.customerName,
      total: `Rp ${(o.totalAmount || o.total || 0).toLocaleString("id-ID")}`,
      method: o.paymentMethod,
      status: o.status,
    })),
    {
      id: "TRX-20261009-001",
      date: "09/10/2026 09:15",
      type: "Online",
      customer: "Siska (Web)",
      total: "Rp 128.000",
      method: "QRIS",
      status: "Dikemas",
    },
  ];

  const filteredTransactions = transactions.filter(
    (trx) =>
      trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#8D5B3A] mb-1">
          <LayoutDashboard size={20} />
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        <p className="text-xs text-gray-400">
          Ringkasan operasional pesanan dan stok bahan kue hari ini
        </p>
      </div>

      {/* Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Pesanan Online */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-indigo-800">
              Pesanan Online
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Globe size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">12</p>
          <p className="text-[11px] text-indigo-600 font-medium">
            <span className="font-bold">Perlu Dikemas</span> (Web/WA)
          </p>
        </div>

        {/* Pesanan Offline / Toko Fisik */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-emerald-800">
              Transaksi Kasir (Offline)
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Store size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">{totalOfflineSelesai}</p>
          <p className="text-[11px] text-emerald-600 font-medium">
            <span className="font-bold">Selesai</span> di Toko Fisik
          </p>
        </div>

        {/* Peringatan Stok Menipis */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-amber-800">
              Stok Bahan Kritis
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">
            {stokKritis.length} <span className="text-xs font-normal text-gray-500">Item</span>
          </p>
          <p className="text-[11px] text-amber-600 font-medium">
            Stok ≤ 10 / Menipis
          </p>
        </div>

        {/* Total Keseluruhan Produk */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-purple-800">
              Total Katalog Produk
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">{totalProduk}</p>
          <p className="text-[11px] text-purple-600 font-medium">
            Terdaftar di Sistem
          </p>
        </div>
      </div>

      {/* Widget Tambahan: Peringatan Stok & Kadaluwarsa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Box Stok Menipis */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-800 font-bold text-sm">
            <AlertTriangle size={16} />
            <h4>Daftar Bahan Kue Perlu Restock ({stokKritis.length})</h4>
          </div>
          {stokKritis.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stokKritis.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-amber-50/40 rounded-xl">
                  <span className="font-semibold text-gray-800">{item.nama}</span>
                  <span className="bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                    Sisa: {item.stok} {item.satuan || "pcs"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Semua stok bahan aman.</p>
          )}
        </div>

        {/* Box Expired / Kadaluwarsa */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-rose-800 font-bold text-sm">
            <Clock size={16} />
            <h4>Bahan Mendekati / Sudah Kadaluwarsa ({expiringSoon.length})</h4>
          </div>
          {expiringSoon.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {expiringSoon.map((item) => {
                const { label } = checkExpiryStatus(item.expiryDate);
                return (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-rose-50/40 rounded-xl">
                    <span className="font-semibold text-gray-800">{item.nama}</span>
                    <span className="bg-rose-200/60 text-rose-900 px-2 py-0.5 rounded-md font-bold">
                      {item.expiryDate} ({label})
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Tidak ada bahan yang mendekati masa kadaluwarsa.</p>
          )}
        </div>

      </div>

      {/* Tabel Penjualan Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#8D5B3A]" size={18} />
            <h3 className="font-bold text-gray-800 text-sm">
              Transaksi Penjualan Terbaru (Online & Offline)
            </h3>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="py-3.5 px-4">Tipe</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Total Belanja</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((trx, index) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-medium text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {trx.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        trx.type === 'Online' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{trx.date}</td>
                    <td className="py-3.5 px-4">{trx.customer}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      {trx.total}
                    </td>
                    <td className="py-3.5 px-4">{trx.method}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        trx.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-400">
                    Belum ada data transaksi yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}