import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

// Sesuaikan URL endpoint ini dengan backend Anda
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

    if (!email.trim() || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Kirim request login ke backend
      const response = await axios.post(API_LOGIN_URL, {
        email: email.trim(),
        password: password,
      });

      // 2. Ambil token & user data (Mendukung fallback struktur response)
      const token = response.data.token || response.data.accessToken;
      const user = response.data.user || response.data.data;

      if (!token || !user) {
        setErrorMsg("Format respons login dari server tidak valid.");
        return;
      }
      console.log(user);

      // 3. Normalisasi Role
      const role = String(user.Jabatan || "").toLowerCase();

      // Jika akun ini bertipe Admin/Owner, cegah masuk lewat portal pelanggan
      if (["admin", "owner"].includes(role)) {
        setErrorMsg(
          "Akun ini adalah akun staf. Silakan login melalui Portal Internal Admin.",
        );
        return;
      }

      // 4. Simpan Session ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role || "pelanggan");

      // Mengambil nama dari berbagai opsi nama field database
      const userName =
        user.nama_user || user.nama_lengkap || user.nama || user.name;
      if (userName) {
        localStorage.setItem("userName", userName);
      }

      // 5. Redirect ke Homepage Pelanggan (Sesuaikan path dengan App.jsx)
      navigate("/pelanggan/homepelanggan", { replace: true });
    } catch (err) {
      console.error("Login pelanggan error:", err);
      if (err.response) {
        setErrorMsg(
          err.response.data?.message ||
            "Email atau password salah. Silakan coba lagi.",
        );
      } else {
        setErrorMsg(
          "Gagal terhubung ke server. Pastikan backend telah berjalan.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-amber-900/5 max-w-md w-full">
        {/* Header Portal Pelanggan */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#3E2723]">Masuk Pelanggan</h2>
          <p className="text-sm text-amber-900/60 mt-1">
            Silakan masuk dengan akun Harafina Anda
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
                placeholder="nama@email.com"
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
            className="w-full bg-[#8D5B28] hover:bg-[#6D421E] text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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

        <div className="mt-6 pt-4 border-t border-amber-900/10 text-center space-y-2">
          <p className="text-xs text-amber-900/70">
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
    </div>
  );
}
