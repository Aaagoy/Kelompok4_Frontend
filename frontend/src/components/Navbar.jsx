import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 border-b px-6">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-amber-600 flex items-center gap-2">
          <span>🧁</span> Toko Harafina
        </Link>
      </div>
      <div className="flex gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => `btn btn-sm ${isActive ? "btn-warning" : "btn-ghost"}`}
        >
          Katalog Produk
        </NavLink>
        <Link to="/login" className="btn btn-amber btn-sm bg-amber-500 hover:bg-amber-600 text-white border-none">
          Login Staff
        </Link>
      </div>
    </div>
  );
};

export default Navbar;