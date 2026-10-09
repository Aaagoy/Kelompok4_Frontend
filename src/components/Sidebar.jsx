import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";

const Sidebar = ({ menuItems = [], brandName = "Harafina" }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Inisialisasi state agar langsung terbuka jika URL aktif mengandung "/laporan"
  const [isReportOpen, setIsReportOpen] = useState(
    location.pathname.includes("/laporan")
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
              // Jika menu adalah Laporan, buatkan dropdown sub-menu
              if (item.name.toLowerCase() === "laporan" || item.path === "/laporan") {
                const isReportActive = location.pathname.includes("/laporan");

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

                    {/* Sub-menu Dropdown */}
                    {isReportOpen && (
                      <div className="pl-7 pr-1 py-1 space-y-1 mt-1 border-l border-white/10 ml-4">
                        <Link
                          to="/laporan/penjualan"
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === "/laporan/penjualan"
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Laporan Penjualan
                        </Link>
                        <Link
                          to="/laporan/pembelian"
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === "/laporan/pembelian"
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Laporan Pembelian
                        </Link>
                        <Link
                          to="/laporan/keuangan"
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-xs font-medium transition ${
                            location.pathname === "/laporan/keuangan"
                              ? "bg-[#8D5B28] text-white font-semibold"
                              : "text-slate-400 hover:bg-[#1a1a1a] hover:text-white"
                          }`}
                        >
                          Laporan Keuangan
                        </Link>
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

        {/* Profile Footer */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-white/5 rounded-xl mt-auto">
          <div className="w-7 h-7 rounded-full bg-[#8D5B28] text-white flex items-center justify-center text-[11px] font-bold shadow-inner shrink-0">
            {brandName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-white truncate">{brandName}</p>
            <p className="text-[9px] text-slate-400 truncate">Admin</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;