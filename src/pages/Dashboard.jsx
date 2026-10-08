import { useMemo, useState } from "react";
import {
  Store,
  UserRound,
  Search,
  Eye,
  FileText,
  UsersRound,
  CircleDollarSign,
  Package,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const transactions = [
  {
    id: "TRX-20251003-001",
    date: "03/10/2025 09:15",
    customer: "Pelanggan Umum",
    total: "Rp 128.000",
    payment: "Tunai",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-002",
    date: "03/10/2025 10:32",
    customer: "Andi Saputra",
    total: "Rp 75.000",
    payment: "QRIS",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-003",
    date: "03/10/2025 11:05",
    customer: "Siti Nurhaliza",
    total: "Rp 164.000",
    payment: "Tunai",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-004",
    date: "03/10/2025 12:17",
    customer: "Budi Santoso",
    total: "Rp 92.000",
    payment: "Kartu",
    status: "Proses",
  },
  {
    id: "TRX-20251003-005",
    date: "03/10/2025 13:45",
    customer: "Pelanggan Umum",
    total: "Rp 56.000",
    payment: "Tunai",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-006",
    date: "03/10/2025 14:20",
    customer: "Dewi Lestari",
    total: "Rp 210.000",
    payment: "QRIS",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-007",
    date: "03/10/2025 15:10",
    customer: "Rizky Pratama",
    total: "Rp 87.000",
    payment: "Tunai",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-008",
    date: "03/10/2025 16:37",
    customer: "Nina Aprilia",
    total: "Rp 135.000",
    payment: "Kartu",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-009",
    date: "03/10/2025 17:22",
    customer: "Agus Setiawan",
    total: "Rp 78.000",
    payment: "QRIS",
    status: "Selesai",
  },
  {
    id: "TRX-20251003-010",
    date: "03/10/2025 18:05",
    customer: "Dinda Permata",
    total: "Rp 120.000",
    payment: "Tunai",
    status: "Selesai",
  },
];

const summaryData = [
  {
    title: "Total Penjualan",
    value: "Rp 1.234.567.890",
    percentage: "12%",
    color: "green",
    icon: CircleDollarSign,
  },
  {
    title: "Total Transaksi",
    value: "456",
    percentage: "8%",
    color: "blue",
    icon: FileText,
  },
  {
    title: "Total Produk",
    value: "120",
    percentage: "5%",
    color: "purple",
    icon: Package,
  },
  {
    title: "Total Pelanggan",
    value: "320",
    percentage: "7%",
    color: "orange",
    icon: UsersRound,
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");

  // React Router
  const navigate = useNavigate();

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(keyword) ||
        transaction.customer.toLowerCase().includes(keyword) ||
        transaction.payment.toLowerCase().includes(keyword),
    );
  }, [search]);

  function handleLogout() {
    navigate("/homepage");
  }

  return (
    <>
      <Sidebar />
      <div className="md:ml-56">
        <main className="min-h-screen bg-[#f5f8fc] text-[#15233f]">
          {/* =====================================================
              TOPBAR
          ====================================================== */}

          <header className="flex items-center justify-between border-b border-[#e7edf5] bg-white px-7">
            {/* COMPANY */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center text-blue-600">
                <Store size={38} strokeWidth={1.8} />
              </div>

              <div>
                <h1 className="text-[17px] font-bold text-[#16243f]">
                  Harafina
                </h1>
                <p className="mt-0.5 text-[13px] text-[#64789a]">
                  “Belanja Mudah, Hidup Lebih Baik”
                </p>
              </div>
            </div>

            {/* ADMIN */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#e8eef7] text-[#536b8e]">
                <UserRound size={23} strokeWidth={1.8} />
              </div>

              <span className="text-sm font-semibold text-[#17233c]">
                Admin
              </span>

              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-[#FECDD3] bg-[#E11D48] p-2 font-mono text-sm text-[#FFFFFF] hover:bg-[#BE123C] hover:text-[#FFFFFF]"
                onClick={handleLogout}
              >
                <span>
                  <LogOut size={17} />
                </span>
                Logout
              </button>
            </div>
          </header>

          {/* =====================================================
              DASHBOARD CONTENT
          ====================================================== */}

          <section className="px-7 pb-10 pt-7">
            {/* HEADER */}

            <div className="mb-6 flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f0ff] text-blue-600">
                <LayoutDashboard size={22} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-[28px] font-extrabold leading-none text-[#13213c]">
                  Dashboard
                </h2>
                <p className="mt-1.5 text-[13px] text-[#6680a5]">
                  Ringkasan aktivitas penjualan hari ini
                </p>
              </div>
            </div>

            {/* ===================================================
                SUMMARY
            ==================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryData.map((item) => {
                const Icon = item.icon;

                const colorStyles = {
                  green: {
                    card: "border-[#bce8d5] bg-gradient-to-br from-[#f7fffb] to-[#effbf6]",
                    icon: "bg-[#cef4df] text-[#129464]",
                    decoration: "bg-[#a9e8c7]",
                  },

                  blue: {
                    card: "border-[#c5dcff] bg-gradient-to-br from-[#f9fbff] to-[#eef5ff]",
                    icon: "bg-[#d9e9ff] text-[#1268d9]",
                    decoration: "bg-[#b3d1ff]",
                  },

                  purple: {
                    card: "border-[#ded1ff] bg-gradient-to-br from-[#fcfaff] to-[#f5efff]",
                    icon: "bg-[#e9dcff] text-[#7146dc]",
                    decoration: "bg-[#dcc9ff]",
                  },

                  orange: {
                    card: "border-[#f3dbad] bg-gradient-to-br from-[#fffdf8] to-[#fff7e7]",
                    icon: "bg-[#ffe5b2] text-[#c58318]",
                    decoration: "bg-[#ffdc9c]",
                  },
                }[item.color];

                return (
                  <article
                    key={item.title}
                    className={`relative overflow-hidden rounded-xl border p-5 ${colorStyles.card}`}
                  >
                    <div className="relative z-10 flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colorStyles.icon}`}
                      >
                        <Icon size={25} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="mb-1 text-[13px] text-[#334a6d]">
                          {item.title}
                        </p>
                        <h3 className="text-[20px] font-extrabold text-[#14213b]">
                          {item.value}
                        </h3>
                      </div>
                    </div>

                    <div className="relative z-10 mt-3 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0e9b67]">
                        ↑ {item.percentage}
                      </span>
                      <span className="text-[11px] text-[#6780a2]">
                        dari kemarin
                      </span>
                    </div>

                    <div
                      className={`absolute -bottom-10 -right-7 h-24 w-36 rotate-[-18deg] rounded-full opacity-40 ${colorStyles.decoration}`}
                    />
                  </article>
                );
              })}
            </div>

            {/* ===================================================
                TRANSACTION
            ==================================================== */}

            <section className="overflow-hidden rounded-xl border border-[#e6edf6] bg-white shadow-sm shadow-slate-200/30">
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-[#edf1f6] px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg bg-[#edf4ff] text-blue-600">
                    <FileText size={19} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-bold text-[#172540]">
                    Transaksi Penjualan Terbaru
                  </h3>
                </div>

                {/* SEARCH */}

                <div className="flex items-center gap-2 rounded-lg border border-[#dce5f0] bg-white px-3">
                  <Search
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8193af]"
                  />
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full bg-transparent text-xs text-[#263b5d] outline-none placeholder:text-[#91a0b6]"
                  />
                </div>
              </div>

              {/* TABLE */}

              <div className="overflow-x-auto px-3.5">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f4f7fc]">
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        No
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        ID Transaksi
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Tanggal
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Pelanggan
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Total Belanja
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Metode Pembayaran
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-bold text-[#31486c]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-[#edf1f6] transition-colors hover:bg-[#fafcff]"
                      >
                        <td className="px-3 py-3 text-[11px] text-[#4d6385]">
                          {index + 1}
                        </td>
                        <td className="px-3 py-3 text-[11px] font-medium text-[#31588f]">
                          {transaction.id}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-[#4d6385]">
                          {transaction.date}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-[#4d6385]">
                          {transaction.customer}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-[#4d6385]">
                          {transaction.total}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-[#4d6385]">
                          {transaction.payment}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex h-6 items-center justify-center rounded-md px-2.5 text-[10px] font-semibold ${
                              transaction.status === "Selesai"
                                ? "bg-[#dcf7e9] text-[#11915e]"
                                : "bg-[#fff0d7] text-[#e59016]"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <button
                            type="button"
                            aria-label={`Lihat ${transaction.id}`}
                            className="flex h-7 items-center justify-center rounded-md bg-[#f0f4fa] text-[#2863ae] transition hover:bg-[#e3ecfa]"
                          >
                            <Eye size={15} strokeWidth={1.8} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="h-28 text-center text-xs text-[#8292aa]"
                        >
                          {" "}
                          Data transaksi tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}

              <div className="flex items-center justify-between px-4">
                <p className="text-[11px] text-[#7185a3]">
                  {" "}
                  Menampilkan {filteredTransactions.length} dari{" "}
                  {transactions.length} data
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled
                    className="flex cursor-not-allowed items-center justify-center rounded-md bg-[#f1f5fa] text-[#9aa9bc]"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    disabled
                    className="flex cursor-not-allowed items-center justify-center rounded-md bg-[#f1f5fa] text-[#9aa9bc]"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </>
  );
}
