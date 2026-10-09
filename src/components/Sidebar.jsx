import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems = [], brandName = "Harafina" }) => {
  const location = useLocation();

  return (
    <aside className="w-60 bg-black text-slate-300 h-screen flex flex-col justify-between p-3.5 border-r border-[#222222] shadow-xl shrink-0 overflow-y-auto">
      <div>
        {/* Brand / Logo, Portal Harafina, dan Internal System */}
        <div className="flex items-center gap-3 px-3 py-4 mb-3 border-b border-white/10">
          <img 
            src="/logo.jpeg" 
            alt="Logo Harafina" 
            className="w-10 h-10 rounded-xl object-cover border border-amber-200/20 shrink-0 shadow-sm" 
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

        {/* Navigasi Dinamis */}
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
                    : 'text-slate-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="flex items-center gap-2.5 px-2.5 py-2 bg-white/5 rounded-xl mt-auto">
        <div className="w-7 h-7 rounded-full bg-[#8D5B28] text-white flex items-center justify-center text-[11px] font-bold shadow-inner shrink-0">
        </div>
        <div className="overflow-hidden">
          <p className="text-[11px] font-bold text-white truncate">{brandName}</p>
          <p className="text-[9px] text-slate-400 truncate">Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;