import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    // Data khusus staf internal (Admin, Owner, Kasir)
    const internalUsers = [
      { id: 1, name: "Admin Utama", email: "admin@harafina.com", role: "admin" },
      { id: 2, name: "Hendra Wijaya", email: "owner@harafina.com", role: "owner" },
      { id: 3, name: "Rudi Hartono", email: "rudi@harafina.com", role: "kasir" }
    ];

    const foundUser = internalUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setErrorMsg("Akses ditolak! Email internal tidak ditemukan.");
      return;
    }

    // Simpan sesi khusus internal ke localStorage
    localStorage.setItem("token", "dummy-token-internal-harafina");
    const userRole = foundUser.role.toLowerCase();
    localStorage.setItem("role", userRole);
    localStorage.setItem("userName", foundUser.name);

    // Redirect berdasarkan role internal toko bahan kue
    if (userRole === "admin") {
      navigate("/dashboard"); // Dashboard utama manajemen toko
    } else if (userRole === "owner") {
      navigate("/laporan"); // Halaman laporan keuangan & analisis owner
    } else if (userRole === "kasir") {
      navigate("/admin/pos"); // Halaman POS / Kasir Toko Bahan Kue
    }
  };

  return (
    <div className="min-h-screen bg-[#2D1B18] flex items-center justify-center p-4">
      <div className="bg-[#3E2723] p-8 rounded-3xl shadow-2xl border border-amber-500/20 max-w-md w-full text-white">
        
        {/* Header Khusus Internal */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">
            Portal Internal Toko
          </h2>
          <p className="text-xs text-amber-200/60 mt-1">
            Khusus Admin, Owner, dan Kasir Harafina
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-amber-200/80 uppercase tracking-wider mb-2">
              EMAIL INTERNAL / STAF
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 absolute left-4 text-amber-300/40" />
              <input
                type="email"
                placeholder="nama@harafina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#2D1B18] border border-amber-900/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-200/80 uppercase tracking-wider mb-2">
              PASSWORD AKSES
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-4 text-amber-300/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#2D1B18] border border-amber-900/30 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-amber-300/40 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
          >
            <span>Masuk Sistem Internal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-900/30 text-center">
          <p className="text-xs text-amber-200/50">
            Kembali ke beranda pelanggan?{" "}
            <Link to="/" className="font-bold text-amber-400 hover:underline">
              Klik di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;