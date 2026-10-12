import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { 
  ShoppingBag, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Search 
} from "lucide-react";

export default function PurchaseReport() {
  // Ambil data pembelian secara real-time dari localStorage
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("purchases_data");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Sinkronisasi real-time jika ada perubahan data dari menu transaksi pembelian
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("purchases_data");
      if (saved) setPurchases(JSON.parse(saved));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hitung Metrik / Statistik Laporan
  const totalPurchasesCount = purchases.length;
  const totalExpense = purchases.reduce((sum, item) => sum + Number(item.totalCost || 0), 0);
  const totalItemQty = purchases.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  // Filter Data Berdasarkan Pencarian & Rentang Tanggal
  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch =
      item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemsName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      (!startDate || item.date >= startDate) &&
      (!endDate || item.date <= endDate);

    return matchesSearch && matchesDate;
  });

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Pembelian</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekapitulasi total pengeluaran dan riwayat restock barang dari supplier (Read-Only).
          </p>
        </div>
      </div>

      {/* KARTU METRIK / STATISTIK LAPORAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Transaksi Masuk</p>
            <p className="text-xl font-bold text-slate-900">{totalPurchasesCount} PO</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Pengeluaran (Modal)</p>
            <p className="text-xl font-bold text-emerald-700">
              Rp {totalExpense.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Barang Dibeli</p>
            <p className="text-xl font-bold text-slate-900">{totalItemQty} Pcs / Unit</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/85 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari no invoice, supplier, atau barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent focus:outline-none text-xs"
            />
            <span>s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent focus:outline-none text-xs"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-xs text-rose-600 hover:underline font-medium px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Tabel Rekapitulasi Laporan Pembelian */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/85 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">No. Invoice</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Supplier / Vendor</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Jumlah</th>
                <th className="py-3.5 px-4">Total Biaya</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">
                      {item.invoice}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">{item.date}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">{item.supplier}</td>
                    <td className="py-4 px-4 text-slate-600">{item.itemsName}</td>
                    <td className="py-4 px-4 text-slate-600">{item.qty} pcs</td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      Rp {item.totalCost.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Belum ada data rekapitulasi laporan pembelian.
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