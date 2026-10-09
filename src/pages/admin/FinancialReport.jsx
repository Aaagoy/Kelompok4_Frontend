import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Search 
} from "lucide-react";

export default function FinancialReport() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("Semua"); // Semua, Masuk, Keluar

  // Sinkronisasi data otomatis dari localStorage (Penjualan Online/Offline & Pembelian)
  useEffect(() => {
    let combinedList = [];

    // 1. Ambil data pesanan offline dari localStorage ("offline_orders_data")
    const savedOfflineOrders = localStorage.getItem("offline_orders_data");
    if (savedOfflineOrders) {
      const offlineParsed = JSON.parse(savedOfflineOrders);
      offlineParsed.forEach((item) => {
        // Hanya masukkan ke Uang Masuk jika status pesanan adalah "Selesai"
        if (item.status === "Selesai") {
          combinedList.push({
            id: `IN-${item.id}`,
            type: "Masuk",
            category: "Penjualan Toko (Offline)",
            description: `Pesanan #${item.id} (${item.customerName || 'Pelanggan'})`,
            date: item.date ? item.date.split(" ")[0] : new Date().toISOString().split("T")[0],
            amount: Number(item.totalAmount || item.total || 0),
          });
        }
      });
    }

    // 2. Ambil data penjualan lain jika ada ("sales_data")
    const savedSales = localStorage.getItem("sales_data");
    if (savedSales) {
      const salesParsed = JSON.parse(savedSales);
      salesParsed.forEach((item, index) => {
        combinedList.push({
          id: `SALE-${item.id || index}`,
          type: "Masuk",
          category: "Penjualan Online",
          description: `Transaksi Penjualan #${item.invoice || item.id || (index + 1)}`,
          date: item.date || item.tanggal || new Date().toISOString().split("T")[0],
          amount: Number(item.total || item.totalBelanja || item.harga || 0),
        });
      });
    }

    // Jika belum ada data sama sekali di localStorage, masukkan data default
    if (!savedOfflineOrders && !savedSales) {
      combinedList.push(
        { id: "IN-1", type: "Masuk", category: "Penjualan Toko (Offline)", description: "Pesanan #TRX-OFF-001 (Ibu Siska)", date: "2026-10-09", amount: 65000 },
        { id: "IN-2", type: "Masuk", category: "Penjualan Online", description: "Pesanan Grosir Tepung & Gula", date: "2026-10-05", amount: 1250000 }
      );
    }

    // 3. Ambil data pembelian / restock dari localStorage ("purchases_data")
    const savedPurchases = localStorage.getItem("purchases_data");
    if (savedPurchases) {
      const purchasesParsed = JSON.parse(savedPurchases);
      purchasesParsed.forEach((item, index) => {
        combinedList.push({
          id: `OUT-${item.id || index}`,
          type: "Keluar",
          category: "Pembelian / Restock",
          description: `Restock: ${item.itemsName || 'Barang'} (${item.supplier})`,
          date: item.date || new Date().toISOString().split("T")[0],
          amount: Number(item.totalCost || 0),
        });
      });
    } else {
      // Data dummy fallback pembelian
      combinedList.push(
        { id: "OUT-1", type: "Keluar", category: "Pembelian / Restock", description: "Restock: Gula Semut Mentah (PT. Nira Sejahtera)", date: "2026-10-01", amount: 1000000 },
        { id: "OUT-2", type: "Keluar", category: "Pembelian / Restock", description: "Restock: Tepung Terigu Premium (CV. Tepung Nusantara)", date: "2026-10-05", amount: 450000 }
      );
    }

    // Urutkan berdasarkan tanggal terbaru
    combinedList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(combinedList);
  }, []);

  // Hitung Metrik Keuangan Sinkron
  const totalIn = transactions
    .filter(t => t.type === "Masuk")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.type === "Keluar")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIn - totalOut;

  // Filter Data Berdasarkan Pencarian, Tanggal, & Jenis Arus Kas
  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "Semua" ? true : item.type === filterType;

    const matchesDate =
      (!startDate || item.date >= startDate) &&
      (!endDate || item.date <= endDate);

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Keuangan & Arus Kas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekapitulasi otomatis uang masuk dari pesanan offline selesai dan uang keluar (restock) toko Harafina.
          </p>
        </div>
      </div>

      {/* KARTU METRIK KEUANGAN SINKRON */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Uang Masuk (Pendapatan)</p>
            <p className="text-xl font-bold text-emerald-700">
              Rp {totalIn.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <TrendingDown size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Uang Keluar (Pengeluaran)</p>
            <p className="text-xl font-bold text-rose-700">
              Rp {totalOut.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Saldo / Selisih Bersih</p>
            <p className={`text-xl font-bold ${netBalance >= 0 ? "text-slate-900" : "text-rose-600"}`}>
              Rp {netBalance.toLocaleString("id-ID")}
            </p>
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
            placeholder="Cari deskripsi atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter Tab Masuk/Keluar */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            {["Semua", "Masuk", "Keluar"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  filterType === tab
                    ? "bg-[#8D5B28] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rentang Tanggal */}
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
        </div>
      </div>

      {/* Tabel Laporan Keuangan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/85 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Jenis</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Keterangan / Transaksi</th>
                <th className="py-3.5 px-6 text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      {item.type === "Masuk" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                          <ArrowDownRight size={14} /> Uang Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-100 rounded-full">
                          <ArrowUpRight size={14} /> Uang Keluar
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">{item.date}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{item.category}</td>
                    <td className="py-4 px-4 text-slate-600">{item.description}</td>
                    <td className={`py-4 px-6 text-right font-bold ${item.type === "Masuk" ? "text-emerald-700" : "text-rose-700"}`}>
                      {item.type === "Masuk" ? "+ " : "- "}Rp {item.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada data transaksi keuangan yang ditemukan.
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