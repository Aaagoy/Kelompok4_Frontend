import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FileText,
  Search,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";

export default function ReportManagement() {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("offline_orders_data");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem("offline_orders_data");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Metrik Statistik
  const completedOrders = orders.filter(o => o.status === "Selesai");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransactions = orders.length;
  const averageOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

  // Filter Data Laporan sesuai Input Desain
  const filteredReports = orders.filter((order) => {
    const matchSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === "Semua" || order.status === filterStatus;

    let matchDate = true;
    if (startDate || endDate) {
      const orderDateOnly = order.date.split(" ")[0]; // Format 'YYYY-MM-DD'
      if (startDate && orderDateOnly < startDate) matchDate = false;
      if (endDate && orderDateOnly > endDate) matchDate = false;
    }

    return matchSearch && matchStatus && matchDate;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format) => {
    alert(`Berhasil mengekspor laporan ke format ${format.toUpperCase()}!`);
  };

  return (
    <DashboardLayout>
      {/* Header Halaman dengan FileText */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-800 mb-1">
            <FileText size={24} className="text-[#8D5B3A]" />
            <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
          </div>
          <p className="text-sm text-slate-500">Laporan semua pembelian dan transaksi toko.</p>
        </div>
      </div>

      {/* KARTU METRIK RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Pendapatan (Omzet)</p>
            <p className="text-lg font-extrabold text-emerald-700">Rp {totalRevenue.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingCart size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Transaksi</p>
            <p className="text-lg font-extrabold text-slate-900">{totalTransactions} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Rata-rata Belanja (AOV)</p>
            <p className="text-lg font-extrabold text-slate-900">Rp {averageOrderValue.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* KARTU UTAMA LAPORAN SEPERTI GAMBAR REFERENSI */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Laporan semua pembelian
        </h3>

        {/* Panel Filter Tanggal & Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal selesai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20"
            >
              <option value="Semua">Semua</option>
              <option value="Selesai">Selesai</option>
              <option value="Sedang Disiapkan">Sedang Disiapkan</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {}}
              className="w-full flex items-center justify-center gap-1.5 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Filter size={14} /> Lihat
            </button>
          </div>
        </div>

        {/* Toolbar Tombol Ekspor (PDF, Excel, CSV, Print) menggunakan Download */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download size={13} /> PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download size={13} /> Excel
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download size={13} /> Csv
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Printer size={13} /> Print
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20"
            />
          </div>
        </div>

        {/* Tabel Data Laporan */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFEA] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 w-16">No</th>
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jumlah</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{report.customerName}</td>
                    <td className="py-3 px-4 text-slate-500">{report.date.split(" ")[0]}</td>
                    <td className="py-3 px-4 font-bold text-[#8D5B3A]">
                      Rp {report.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {report.status === "Selesai" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                          <CheckCircle2 size={11} /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                          <Clock size={11} /> Sedang Disiapkan
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada data transaksi yang ditemukan pada rentang tanggal/filter tersebut.
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