import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, BarChart3, ShoppingCart } from "lucide-react";

const Sidebar = ({ menuItems = [], brandName = "Harafina" }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Ambil data user aktif dari localStorage
  const currentUserName = localStorage.getItem("userName") || brandName;
  const rawRole = localStorage.getItem("role") || "staf";
  // Format tampilan role agar huruf pertamanya kapital (misal: "owner" -> "Owner")
  const currentRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

  // Cek apakah halaman aktif saat ini berada di area Owner
  const isOwnerArea = location.pathname.startsWith("/owner");

  // Inisialisasi state agar langsung terbuka jika URL aktif mengandung "/laporan" atau "/transaksi"
  const [isReportOpen, setIsReportOpen] = useState(
    location.pathname.includes("/laporan")
  );
  const [isTransactionOpen, setIsTransactionOpen] = useState(
    location.pathname.includes("/transaksi")
  );

  return (
    <>
      {/* MOBILE BURGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-3.5 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-md border border-[#222222] md:hidden cursor-pointer"
        aria-label="Buka navigasi"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex w-64 min-w-[16rem] flex-col bg-black text-slate-300 h-screen p-3.5 border-r border-[#222222] shadow-xl shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* MOBILE CLOSE BUTTON & BRAND HEADER */}
          <div className="flex items-center justify-between px-3 py-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src="/logo.jpeg" 
                alt="Logo Harafina" 
                className="w-9 h-9 rounded-xl object-cover border border-amber-200/20 shrink-0 shadow-sm" 
              />
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-xs font-bold text-white truncate">
                  Portal Harafina
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                  internal system
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Tutup navigasi"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigasi Dinamis */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              // Jika menu adalah Transaksi, buatkan dropdown sub-menu
              if (item.name.toLowerCase() === "transaksi" || item.path === "/transaksi") {
                const isTransactionActive = location.pathname.includes("/transaksi");

                return (
                  <div key="menu-transaksi">
                    <button
                      onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isTransactionActive
                          ? "bg-[#8D5B28] text-white shadow-sm font-semibold"
                          : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 shrink-0" />
                        <span className="truncate">Transaksi</span>
                      </div>
                      {isTransactionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {/* Sub-menu Dropdown Transaksi */}
                    {isTransactionOpen && (
                      <div className="pl-7 pr-1 py-1 space-y-1 mt-1 border-l border-white/10 ml-4">
                        <Link
                          to="/transaksi/penjualan"
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === "/transaksi/penjualan"
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Transaksi Penjualan
                        </Link>
                        <Link
                          to="/transaksi/pembelian"
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === "/transaksi/pembelian"
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Transaksi Pembelian
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              // Jika menu adalah Laporan, buatkan dropdown sub-menu
              if (item.name.toLowerCase() === "laporan" || item.path.includes("/laporan")) {
                const isReportActive = location.pathname.includes("/laporan");
                
                // Tentukan prefix rute berdasarkan area (owner atau admin)
                const salesReportPath = isOwnerArea ? "/owner/laporan/penjualan" : "/laporan/penjualan";
                const purchaseReportPath = isOwnerArea ? "/owner/laporan/pembelian" : "/laporan/pembelian";
                const financialReportPath = isOwnerArea ? "/owner/laporan/keuangan" : "/laporan/keuangan";

                return (
                  <div key="menu-laporan">
                    <button
                      onClick={() => setIsReportOpen(!isReportOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isReportActive
                          ? "bg-[#8D5B28] text-white shadow-sm font-semibold"
                          : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="w-4 h-4 shrink-0" />
                        <span className="truncate">Laporan</span>
                      </div>
                      {isReportOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {/* Sub-menu Dropdown Laporan */}
                    {isReportOpen && (
                      <div className="pl-7 pr-1 py-1 space-y-1 mt-1 border-l border-white/10 ml-4">
                        <Link
                          to={salesReportPath}
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === salesReportPath
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Laporan Penjualan
                        </Link>
                        <Link
                          to={purchaseReportPath}
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === purchaseReportPath
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Laporan Pembelian
                        </Link>
                        {!isOwnerArea && (
                          <Link
                            to={financialReportPath}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                              location.pathname === financialReportPath
                                ? "bg-[#8D5B28] text-white font-semibold"
                                : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                            }`}
                          >
                            Laporan Keuangan
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#8D5B28] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Footer Dinamis dari localStorage */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-white/5 rounded-xl mt-auto">
          <div className="w-7 h-7 rounded-full bg-[#8D5B28] text-white flex items-center justify-center text-[11px] font-bold shadow-inner shrink-0">
            {currentUserName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-white truncate">{currentUserName}</p>
            <p className="text-[9px] text-slate-400 truncate">{currentRole}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;