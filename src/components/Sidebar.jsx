import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems = [], brandName = "Harafina" }) => {
  const location = useLocation();

  return (
    <aside className="w-60 bg-[#3E2723] text-amber-100/70 h-screen flex flex-col justify-between p-3.5 shadow-xl shrink-0 overflow-y-auto">
      <div>
        {/* Brand Logo yang Diperkecil & Lebih Kompak */}
        <div className="flex flex-col items-center py-4 mb-3 border-b border-white/10">
          <div className="w-14 h-14 rounded-full bg-[#EBE3D5] flex flex-col items-center justify-center p-1.5 shadow-inner border border-amber-200/20 text-center">
            <span className="font-serif font-bold text-[#3E2723] text-xs leading-tight">{brandName}</span>
            <span className="text-[6px] text-[#5C3D2E] tracking-tighter mt-0.5 font-medium">Bahan Kue & Dapur</span>
          </div>
        </div>

        {/* Navigasi Dinamis dengan Ukuran Lebih Rapat/Kecil */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#8D5B28] text-white shadow-sm font-semibold'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer yang Lebih Ringkas */}
      <div className="flex items-center gap-2.5 px-2.5 py-2 bg-black/20 rounded-xl mt-auto">
        <div className="w-7 h-7 rounded-full bg-[#2C1A17] text-white flex items-center justify-center text-[11px] font-bold shadow-inner shrink-0">
          N
        </div>
        <div className="overflow-hidden">
          <p className="text-[11px] font-bold text-amber-100 truncate">{brandName}</p>
          <p className="text-[9px] text-amber-100/60 truncate">Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;