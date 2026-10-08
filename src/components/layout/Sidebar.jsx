import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { LayoutDashboard, ReceiptText, Package, Calculator, History, Menu, X } from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transaksi",
    href: "/transaksi",
    icon: ReceiptText,
  },
  {
    name: "Produk",
    href: "/produk",
    icon: Package,
  },
  {
    name: "Kasir",
    href: "/kasir",
    icon: Calculator,
  },
  {
    name: "Riwayat",
    href: "/riwayat",
    icon: History,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBILE BURGER BUTTON */}
      <button type="button" onClick={() => setIsOpen(true)} className="fixed left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#101b30] text-white shadow-lg md:hidden" aria-label="Buka navigasi">
        <Menu size={22} strokeWidth={2} />
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <button type="button" aria-label="Tutup navigasi" onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden"/>
      )}
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-[#101b30] text-white transition-transform duration-300 ease-in-out md:translate-x-0
          ${ isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`
      }>
        {/* MOBILE CLOSE BUTTON */}
        <div className="flex h-20 items-center justify-end px-4 md:hidden">
          <button type="button" onClick={() => setIsOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Tutup navigasi">
            <X size={22} />
          </button>
        </div>
        
        {/* LOGO */}
        <div className="flex w-full h-32 items-center justify-center">
          <img src="/logo.jpeg" alt="Logo" className="h-25 w-25 object-contain rounded-full"/>
        </div>
        
        {/* MENU */}
        <nav className="flex flex-col gap-1.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}>
                <Icon size={19} className="shrink-0"/>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}