import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ShoppingBag,
  TrendingUp,
  FileText,
  Calendar,
  Search,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { getExpenses, createExpense } from "../../services/expenseService";
import { getSuppliers } from "../../services/supplierService";
import axios from "axios";

export default function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State untuk modal & form create purchase
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    tanggal: "",
    id_supplier: "",
    nama_barang: "",
    jumlah: "",
    harga: "",
    status: "Selesai",
  });

  // Ambil data dari backend saat komponen dimuat
  async function fetchPurchaseData() {
    try {
      setIsLoading(true);
      setError("");
      const [expenseRes, supplierRes] = await Promise.all([
        getExpenses(),
        getSuppliers().catch(() => ({ data: [] })),
      ]);

      setPurchases(expenseRes.data || []);
      setSuppliers(supplierRes.data || supplierRes || []);
    } catch (err) {
      console.error("Gagal memuat laporan pembelian:", err);
      setError("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  function resetForm() {
    setFormData({
      tanggal: "",
      id_supplier: "",
      nama_barang: "",
      jumlah: "",
      harga: "",
      status: "Selesai",
    });
    setFormError("");
  }

  // Hitung total pengeluaran otomatis secara real-time di frontend
  const calculatedTotal =
    Number(formData.jumlah || 0) * Number(formData.harga || 0);

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setFormError("");

      // Kirim data dengan menyertakan perhitungan total_pengeluaran yang valid
      await createExpense({
        tanggal: formData.tanggal,
        id_supplier: Number(formData.id_supplier),
        nama_barang: formData.nama_barang,
        jumlah: Number(formData.jumlah),
        harga: Number(formData.harga),
        total_pengeluaran: calculatedTotal,
        status: formData.status,
      });

      setIsModalOpen(false);
      resetForm();
      fetchPurchaseData();
    } catch (err) {
      console.error("Gagal menyimpan pembelian:", err);
      setFormError(
        err.response?.data?.message || "Gagal mencatat pembelian baru.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Hitung Metrik / Statistik Laporan berdasarkan data backend
  const totalPurchasesCount = purchases.length;
  const totalExpense = purchases.reduce(
    (sum, item) => sum + Number(item.total_pengeluaran || 0),
    0,
  );
  const totalItemQty = purchases.reduce(
    (sum, item) => sum + Number(item.jumlah || 0),
    0,
  );

  // Filter Data Berdasarkan Pencarian & Rentang Tanggal
  const filteredPurchases = purchases.filter((item) => {
    const supplierName = item.supplier?.nama_supplier || "";
    const matchesSearch =
      item.no_invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      (!startDate || item.tanggal >= startDate) &&
      (!endDate || item.tanggal <= endDate);

    return matchesSearch && matchesDate;
  });

  const handleStatusChange = async (expenseId, newStatus) => {
    try {
      // Panggil API backend untuk update status di database
      await updateExpenseStatus(expenseId, newStatus);

      // Update state lokal agar tabel langsung berubah tanpa perlu refresh manual
      setPurchases((prevPurchases) =>
        prevPurchases.map((item) =>
          item.id_pengeluaran === expenseId
            ? { ...item, status: newStatus }
            : item,
        ),
      );
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
      alert("Gagal mengubah status di database.");
    }
  };

  const updateExpenseStatus = async (id, status) => {
    return await axios.put(`http://localhost:3000/expense/${id}`, { status });
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Laporan Pembelian
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekapitulasi total pengeluaran dan riwayat restock barang dari
            supplier (Terhubung ke Database).
          </p>
        </div>
        <div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            <Plus size={16} />
            <span>Catat Pembelian Baru</span>
          </button>
        </div>
      </div>

      {/* KARTU METRIK / STATISTIK LAPORAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Transaksi Masuk
            </p>
            <p className="text-xl font-bold text-slate-900">
              {totalPurchasesCount} PO
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Pengeluaran (Modal)
            </p>
            <p className="text-xl font-bold text-emerald-700">
              Rp {Number(totalExpense).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Barang Dibeli
            </p>
            <p className="text-xl font-bold text-slate-900">
              {totalItemQty} Pcs / Unit
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
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
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
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Total Biaya</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span>Memuat data laporan dari database...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 text-center text-rose-500 font-medium"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredPurchases.length > 0 ? (
                filteredPurchases.map((item) => (
                  <tr
                    key={item.id_pengeluaran}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">
                      {item.no_invoice}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {item.tanggal}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {item.supplier
                        ? item.supplier.nama_supplier
                        : "Supplier Dihapus"}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {item.nama_barang}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {item.jumlah} pcs
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      Rp {Number(item.harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      Rp{" "}
                      {Number(item.total_pengeluaran || 0).toLocaleString(
                        "id-ID",
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item.id_pengeluaran,
                            e.target.value,
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 cursor-pointer ${
                          item.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : item.status === "Pending"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <option value="Selesai">Selesai</option>
                        <option value="Pending">Pending</option>
                        <option value="Batal">Batal</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Tidak ada data rekapitulasi laporan pembelian yang
                    ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CATAT PEMBELIAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">
                Catat Pembelian Baru (Restock)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  TANGGAL
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  SUPPLIER / VENDOR
                </label>
                <select
                  value={formData.id_supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, id_supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#8D5B3A]"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id_supplier} value={sup.id_supplier}>
                      {sup.nama_supplier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  NAMA BARANG
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tepung Terigu Premium"
                  value={formData.nama_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_barang: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    JUMLAH (PCS)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 50"
                    value={formData.jumlah}
                    onChange={(e) =>
                      setFormData({ ...formData, jumlah: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    HARGA SATUAN (RP)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 20000"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({ ...formData, harga: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                    required
                  />
                </div>
              </div>

              {/* Preview Total Biaya Otomatis */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">
                  Total Pengeluaran (Otomatis):
                </p>
                <p className="text-sm font-bold text-emerald-700">
                  Rp {calculatedTotal.toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">
                  STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#8D5B3A]"
                >
                  <option value="Selesai">Selesai</option>
                  <option value="Pending">Pending</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Pembelian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
