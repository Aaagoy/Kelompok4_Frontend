import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    // Ambil data users dari localStorage atau gunakan default bawaan sistem
    const existingUsers = JSON.parse(localStorage.getItem("users_data")) || [
      { id: 1, name: "Admin", email: "admin@harafina.com", role: "admin" },
      { id: 2, name: "Hendra Wijaya", email: "owner@harafina.com", role: "owner" },
      { id: 3, name: "Rudi Hartono", email: "rudi@harafina.com", role: "kasir" }
    ];

    // Cek apakah email terdaftar di sistem
    const foundUser = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setErrorMsg("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
      return;
    }

    // Simpan token, role, dan nama user ke localStorage
    localStorage.setItem("token", "dummy-token-harafina");
    const userRole = foundUser.role ? foundUser.role.toLowerCase() : "user";
    localStorage.setItem("role", userRole);
    localStorage.setItem("userName", foundUser.name);

    // Redirect berdasarkan role masing-sama:
    if (userRole === "admin") {
      navigate("/dashboard"); // Menuju dashboard admin
    } else if (userRole === "owner") {
      navigate("/laporan"); // Menuju halaman laporan owner (pastikan rute ini ada di App.jsx)
    } else {
      navigate("/"); // Menuju homepage untuk user biasa/kasir
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-amber-900/5 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#3E2723]">Masuk ke Harafina</h2>
          <p className="text-sm text-amber-900/60 mt-1">
            Silakan masukkan akun Anda untuk melanjutkan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
              EMAIL AKUN
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 absolute left-4 text-amber-900/40" />
              <input
                type="email"
                placeholder="nama@harafina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-4 text-amber-900/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-amber-900/40 hover:text-[#3E2723]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8D5B28] hover:bg-[#6D421E] text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 cursor-pointer"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-amber-900/70 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-[#8D5B28] hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;