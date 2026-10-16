import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchLaporanPembelian } from "../../services/laporanService";
import { getErrorMessage } from "../../services/api";
import {
  ShoppingBag,
  TrendingUp,
  FileText,
  Search,
  Calendar,
} from "lucide-react";

// Ubah data BE (snake_case, DECIMAL berupa string) ke format tampilan
const mapExpense = (e) => ({
  id: e.id_pengeluaran,
  noInvoice: e.no_invoice,
  tanggal: String(e.tanggal).slice(0, 10),
  supplier: e.supplier?.nama_supplier ?? "-",
  namaBarang: e.nama_barang,
  jumlah: Number(e.jumlah),
  totalBiaya: Number(e.total_pengeluaran),
  status: e.status,
});

const STATUS_STYLE = {
  Selesai: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-800",
  Batal: "bg-rose-100 text-rose-700",
};

export default function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchLaporanPembelian();
        if (!res || !Array.isArray(res.data)) {
          throw new Error(
            "Respons /expense tidak sesuai. Cek VITE_API_URL dan rute /expense di BE.",
          );
        }
        setPurchases(res.data.map(mapExpense));
      } catch (err) {
        setPurchases([]);
        alert(
          err.response || err.request
            ? getErrorMessage(err, "Gagal memuat laporan pembelian")
            : err.message,
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter pencarian & rentang tanggal (di sisi FE)
  const filtered = purchases.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      p.noInvoice.toLowerCase().includes(q) ||
      p.supplier.toLowerCase().includes(q) ||
      p.namaBarang.toLowerCase().includes(q);

    let matchDate = true;
    if (startDate && p.tanggal < startDate) matchDate = false;
    if (endDate && p.tanggal > endDate) matchDate = false;

    return matchSearch && matchDate;
  });

  // Kartu ringkasan hanya menghitung pembelian berstatus "Selesai"
  // (sama dengan angka "Uang Keluar" di Laporan Keuangan)
  const done = filtered.filter((p) => p.status === "Selesai");
  const totalPO = done.length;
  const totalModal = done.reduce((sum, p) => sum + p.totalBiaya, 0);
  const totalBarang = done.reduce((sum, p) => sum + p.jumlah, 0);

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Laporan Pembelian</h1>
        <p className="text-sm text-slate-500">
          Rekapitulasi total pengeluaran dan riwayat restock barang dari
          supplier (Read-Only).
        </p>
      </div>

      {/* KARTU METRIK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Transaksi Masuk
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {totalPO} PO
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Pengeluaran (Modal)
            </p>
            <p className="text-xl font-extrabold text-emerald-700">
              Rp {totalModal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Barang Dibeli
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {totalBarang.toLocaleString("id-ID")} Pcs / Unit
            </p>
          </div>
        </div>
      </div>

      {/* BAR PENCARIAN & FILTER TANGGAL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
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

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
          <Calendar size={15} className="text-slate-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent focus:outline-none"
          />
          <span>s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* TABEL RIWAYAT PEMBELIAN */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Memuat laporan...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800">
                      {p.noInvoice}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {p.tanggal}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {p.supplier}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{p.namaBarang}</td>
                    <td className="py-4 px-4 text-slate-600">
                      {p.jumlah.toLocaleString("id-ID")} pcs
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-700">
                      Rp {p.totalBiaya.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          STATUS_STYLE[p.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Tidak ada riwayat pembelian yang ditemukan.
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
