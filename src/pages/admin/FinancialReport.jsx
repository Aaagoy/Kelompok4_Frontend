import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchLaporanKeuangan } from "../../services/laporanService";
import { getErrorMessage } from "../../services/api";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export default function FinanceReport() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo_bersih: 0,
  });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("semua"); // semua | pemasukan | pengeluaran
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data diambil ulang dari BE setiap rentang tanggal berubah.
  // Filter Masuk/Keluar & pencarian dilakukan di FE supaya kartu ringkasan tetap utuh.
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchLaporanKeuangan({
          dari: startDate,
          sampai: endDate,
        });
        if (!res || !Array.isArray(res.data) || !res.ringkasan) {
          throw new Error(
            "Respons /report tidak sesuai. Cek VITE_API_URL dan rute /report di BE.",
          );
        }
        setRows(res.data);
        setSummary(res.ringkasan);
      } catch (err) {
        setRows([]);
        alert(
          err.response || err.request
            ? getErrorMessage(err, "Gagal memuat laporan keuangan")
            : err.message,
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [startDate, endDate]);

  const filtered = rows.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.keterangan.toLowerCase().includes(q) ||
      r.kategori.toLowerCase().includes(q);
    const matchJenis = filterJenis === "semua" || r.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const saldo = summary.saldo_bersih;

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Laporan Keuangan & Arus Kas
        </h1>
        <p className="text-sm text-slate-500">
          Rekapitulasi otomatis uang masuk dari pesanan offline selesai dan uang
          keluar (restock) toko Harafina.
        </p>
      </div>

      {/* KARTU METRIK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Uang Masuk (Pendapatan)
            </p>
            <p className="text-xl font-extrabold text-emerald-700">
              Rp {summary.total_pemasukan.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingDown size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Uang Keluar (Pengeluaran)
            </p>
            <p className="text-xl font-extrabold text-rose-600">
              Rp {summary.total_pengeluaran.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Saldo / Selisih Bersih
            </p>
            <p
              className={`text-xl font-extrabold ${
                saldo >= 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              Rp {saldo.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* BAR PENCARIAN & FILTER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="relative w-full lg:w-96">
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

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Semua / Masuk / Keluar */}
          <div className="inline-flex p-1 bg-slate-50 border border-slate-200 rounded-xl">
            {[
              { key: "semua", label: "Semua" },
              { key: "pemasukan", label: "Masuk" },
              { key: "pengeluaran", label: "Keluar" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterJenis(opt.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterJenis === opt.key
                    ? "bg-[#8D5B3A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Rentang tanggal */}
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
      </div>

      {/* TABEL ARUS KAS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Memuat laporan...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((r, idx) => {
                  const masuk = r.jenis === "pemasukan";
                  return (
                    <tr
                      key={`${r.jenis}-${idx}`}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-4 px-6">
                        {masuk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                            <ArrowDownRight size={13} /> Uang Masuk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                            <ArrowUpRight size={13} /> Uang Keluar
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {r.tanggal}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {r.kategori}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {r.keterangan}
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          masuk ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {masuk ? "+" : "-"} Rp{" "}
                        {r.nominal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada transaksi yang ditemukan.
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
