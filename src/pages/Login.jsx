import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

// Pastikan port & endpoint ini sesuai dengan backend Anda
const API_LOGIN_URL = "http://localhost:3000/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Kirim request login ke backend
      const response = await axios.post(API_LOGIN_URL, {
        email: email,
        password: password,
      });

      // 2. Ambil data balasan dari backend
      // (Sesuaikan nama property 'token' dan 'user' dengan response backend Anda)
      const { token, user } = response.data;

      if (token) localStorage.setItem("token", token);

      // Simpan data user ke localStorage
      const role = user?.role ? user.role.toLowerCase() : "pelanggan";
      localStorage.setItem("role", role);
      if (user?.nama_user) localStorage.setItem("userName", user.nama_user);

      // 3. NAVIGASI / REDIRECT BERDASARKAN ROLE
      if (role === "admin") {
        navigate("/admin/dashboard"); // Menuju dashboard admin
      } else if (role === "owner") {
        navigate("/admin/laporan"); // Menuju halaman laporan owner
      } else {
        navigate("/"); // Menuju homepage pelanggan
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Email atau password salah / Gagal terhubung ke server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-amber-900/5 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#3E2723]">
            Masuk ke Portal Harafina
          </h2>
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
                disabled={isLoading}
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all disabled:opacity-60"
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
                disabled={isLoading}
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-amber-900/40 hover:text-[#3E2723]"
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
            disabled={isLoading}
            className="w-full bg-[#8D5B28] hover:bg-[#6D421E] text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-amber-900/70 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-[#8D5B28] hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
