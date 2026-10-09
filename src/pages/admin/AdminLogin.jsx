import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import axios from "axios";

const API_LOGIN_URL = "http://localhost:3000/api/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_LOGIN_URL, {
        email: email.trim(),
        password: password,
      });

      const token = response.data.token || response.data.accessToken;
      const user = response.data.user || response.data.data;

      if (!token || !user) {
        setErrorMsg("Data login dari server tidak lengkap.");
        return;
      }

      const role = String(user.Jabatan || "")
        // .trim()
        .toLowerCase();
      console.log(user);

      if (!["admin", "owner"].includes(role)) {
        setErrorMsg("Akun ini tidak memiliki akses internal.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role || "admin", role || "owner");

      const userName = user.nama_user || user.nama || user.name;

      if (userName) {
        localStorage.setItem("userName", userName);
      }

      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (role === "owner") {
        navigate("/laporan", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response) {
        setErrorMsg(
          err.response.data?.message ||
            "Login gagal. Periksa email dan password.",
        );
      } else {
        setErrorMsg(
          "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D1B18] flex items-center justify-center p-4">
      <div className="bg-[#3E2723] p-8 rounded-3xl shadow-2xl border border-amber-500/20 max-w-md w-full text-white">
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
                disabled={isLoading}
                className="w-full bg-[#2D1B18] border border-amber-900/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-60"
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
                disabled={isLoading}
                className="w-full bg-[#2D1B18] border border-amber-900/30 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-60"
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
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Sistem Internal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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
}
