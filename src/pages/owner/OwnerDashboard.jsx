import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  BarChart2,
  AlertTriangle,
  Clock,
  Search,
  Receipt,
} from "lucide-react";

export default function OwnerDashboard() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [offlineOrders, setOfflineOrders] = useState(() => {
    const saved = localStorage.getItem("offline_orders_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("purchases_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Sinkronisasi otomatis dari localStorage
  useEffect(() => {
    const loadData = () => {
      const savedProducts = localStorage.getItem("products_data");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem("offline_orders_data");
      if (savedOrders) setOfflineOrders(JSON.parse(savedOrders));

      const savedPurchases = localStorage.getItem("purchases_data");
      if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // Helper Cek Masa Kadaluwarsa
  const checkExpiryStatus = (dateString) => {
    if (!dateString) return { status: "safe", label: "Tidak ada info" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateString);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "expired", label: "Kadaluarsa!" };
    if (diffDays <= 30) return { status: "warning", label: `Segera Exp (${diffDays} hr)` };
    return { status: "safe", label: "Aman" };
  };

  // --- KALKULASI RINGKASAN EKSEKUTIF ---
  const totalOmzet = offlineOrders
    .filter((o) => o.status === "Selesai")
    .reduce((acc, curr) => acc + (Number(curr.totalAmount || curr.total) || 0), 0);

  const totalPengeluaran = purchases.reduce(
    (acc, curr) => acc + (Number(curr.totalPrice || curr.total) || 0),
    0
  );

  const labaBersih = totalOmzet - totalPengeluaran;

  const stokKritis = products.filter((p) => {
    const isWithdrawn = p.manualStatus === "Produk Ditarik";
    const currentStatus =
      p.manualStatus ||
      (Number(p.stok) > 10 ? "Tersedia" : Number(p.stok) > 0 ? "Stok Menipis" : "Habis");
    return !isWithdrawn && (currentStatus === "Stok Menipis" || currentStatus === "Habis" || Number(p.stok) <= 10);
  });

  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const { status } = checkExpiryStatus(p.expiryDate);
    return status === "expired" || status === "warning";
  });

  const allTransactions = offlineOrders.map((o) => ({
    id: o.id,
    date: o.date,
    customer: o.customerName,
    total: o.totalAmount || o.total || 0,
    method: o.paymentMethod || "Tunai",
    status: o.status,
  }));

  const filteredTransactions = allTransactions.filter(
    (trx) =>
      trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Cukup gunakan fragment atau div utama tanpa <OwnerLayout>
    <div className="w-full">
      {/* Title Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#8D5B3A] mb-1">
          <BarChart2 size={22} />
          <h2 className="text-2xl font-bold text-gray-900">Owner Dashboard</h2>
        </div>
        <p className="text-xs text-gray-500">
          Ringkasan eksekutif performa finansial, omzet, dan pengawasan aset toko Harafina
        </p>
      </div>

      {/* CARDS METRIK EKSEKUTIF (FINANSIAL & PERFORMA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Omzet Penjualan */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-800">
              Total Omzet Penjualan
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">
            Rp {totalOmzet.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            Pendapatan Kotor Toko
          </p>
        </div>

        {/* Total Modal Restock */}
        <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-800">
              Pengeluaran Restock
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <TrendingDown size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-rose-700 font-medium">
            Pengeluaran Pembelian Bahan
          </p>
        </div>

        {/* Laba / Arus Kas Bersih */}
        <div className={`border rounded-2xl p-5 shadow-sm ${
          labaBersih >= 0 ? "bg-indigo-50/70 border-indigo-100" : "bg-amber-50/70 border-amber-100"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold ${labaBersih >= 0 ? "text-indigo-800" : "text-amber-800"}`}>
              Selisih Kas / Estimasi Laba
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              labaBersih >= 0 ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
            }`}>
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">
            Rp {labaBersih.toLocaleString("id-ID")}
          </p>
          <p className={`text-[11px] font-medium ${labaBersih >= 0 ? "text-indigo-700" : "text-amber-700"}`}>
            {labaBersih >= 0 ? "Kondisi Kas Positif" : "Perlu Evaluasi Modal"}
          </p>
        </div>

        {/* Aset Katalog Bahan Kue */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-800">
              Total Varian Produk
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mb-1">
            {products.length} <span className="text-xs font-normal text-gray-500">Item</span>
          </p>
          <p className="text-[11px] text-purple-700 font-medium">
            Katalog Produk Aktif
          </p>
        </div>

      </div>

      {/* PERINGATAN KONTROL ASET & INVENTARIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Stok Menipis (Aset Kritis) */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-800 font-bold text-sm">
            <AlertTriangle size={16} />
            <h4>Bahan Kue Kritis / Perlu Restock ({stokKritis.length})</h4>
          </div>
          {stokKritis.length > 0 ? (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {stokKritis.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/60">
                  <span className="font-semibold text-gray-800">{item.nama}</span>
                  <span className="bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-md font-bold">
                    Sisa: {item.stok} pcs
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4 text-center">Semua persediaan stok bahan kue dalam kondisi aman.</p>
          )}
        </div>

        {/* Bahan Mendekati Expired */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-rose-800 font-bold text-sm">
            <Clock size={16} />
            <h4>Risiko Kadaluwarsa Bahan Kue ({expiringSoon.length})</h4>
          </div>
          {expiringSoon.length > 0 ? (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {expiringSoon.map((item) => {
                const { label } = checkExpiryStatus(item.expiryDate);
                return (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2.5 bg-rose-50/50 rounded-xl border border-rose-100/60">
                    <span className="font-semibold text-gray-800">{item.nama}</span>
                    <span className="bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-md font-bold">
                      {item.expiryDate} ({label})
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4 text-center">Tidak ada bahan yang berisiko mendekati masa kadaluwarsa.</p>
          )}
        </div>

      </div>

      {/* TABEL PENGAWASAN AUDIT PENJUALAN */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#8D5B3A]" size={18} />
            <h3 className="font-bold text-gray-800 text-sm">
              Ringkasan Audit Transaksi Penjualan Toko
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
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Total Belanja</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Status</th>
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
                    <td className="py-3.5 px-4 text-gray-400">{trx.date}</td>
                    <td className="py-3.5 px-4 font-medium">{trx.customer}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      Rp {Number(trx.total).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">{trx.method}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        trx.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400 italic">
                    Belum ada data transaksi yang dapat diaudit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}