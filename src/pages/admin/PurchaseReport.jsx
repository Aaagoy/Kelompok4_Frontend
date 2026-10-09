import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { 
  ShoppingBag, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Search, 
  Plus, 
  Trash2, 
  X 
} from "lucide-react";

export default function PurchaseReport() {
  // State data pembelian yang tersimpan di localStorage
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("purchases_data");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        invoice: "PO-2026-001",
        supplier: "PT. Nira Sejahtera",
        date: "2026-10-01",
        itemsName: "Gula Semut Mentah (Bulk)",
        qty: 50,
        totalCost: 1000000,
        status: "Selesai"
      },
      {
        id: 2,
        invoice: "PO-2026-002",
        supplier: "CV. Tepung Nusantara",
        date: "2026-10-05",
        itemsName: "Tepung Terigu Premium",
        qty: 30,
        totalCost: 450000,
        status: "Selesai"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("purchases_data", JSON.stringify(purchases));
  }, [purchases]);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State untuk Tambah Pembelian Baru
  const [formData, setFormData] = useState({
    invoice: `PO-2026-00${purchases.length + 1}`,
    supplier: "",
    date: new Date().toISOString().split("T")[0],
    itemsName: "",
    qty: "",
    totalCost: "",
    status: "Selesai"
  });

  // Hitung Metrik / Statistik Pembelian
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

  const handleOpenModal = () => {
    setFormData({
      invoice: `PO-2026-00${purchases.length + 1}`,
      supplier: "",
      date: new Date().toISOString().split("T")[0],
      itemsName: "",
      qty: "",
      totalCost: "",
      status: "Selesai"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier || !formData.itemsName || !formData.totalCost) return;

    const newPurchase = {
      id: Date.now(),
      invoice: formData.invoice,
      supplier: formData.supplier,
      date: formData.date,
      itemsName: formData.itemsName,
      qty: Number(formData.qty) || 0,
      totalCost: Number(formData.totalCost) || 0,
      status: formData.status
    };

    setPurchases([newPurchase, ...purchases]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pembelian ini?")) {
      setPurchases(purchases.filter((p) => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Pembelian</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekapitulasi pengeluaran dan riwayat restock barang dari supplier/vendor.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition cursor-pointer"
        >
          <Plus size={18} />
          Catat Pembelian Baru
        </button>
      </div>

      {/* KARTU METRIK / STATISTIK PEMBELIAN */}
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

      {/* Tabel Laporan Pembelian */}
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
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
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
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Tidak ada data laporan pembelian ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PEMBELIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-lg">Catat Pembelian Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  No. Invoice / PO
                </label>
                <input
                  type="text"
                  value={formData.invoice}
                  onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama Supplier / Vendor
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT. Nira Sejahtera"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tanggal Pembelian
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama Barang yang Dibeli
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gula Semut Mentah (Bulk)"
                  value={formData.itemsName}
                  onChange={(e) => setFormData({ ...formData, itemsName: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Jumlah (Qty)
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Total Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="1000000"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8D5B3A] hover:bg-[#6D4227] rounded-xl shadow-sm transition cursor-pointer"
                >
                  Simpan Pembelian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}