import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !password) {
      setErrorMsg("Semua kolom wajib diisi!");
      return;
    }

    // Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Format email tidak valid (contoh yang benar: nama@domain.com).");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal harus terdiri dari 6 karakter.");
      return;
    }

    // Ambil data user yang sudah ada di localStorage (atau gunakan array kosong jika belum ada)
    const existingUsers = JSON.parse(localStorage.getItem("users_data")) || [
      { id: 1, name: "Admin", email: "admin@harafina.com", role: "Admin" },
      { id: 2, name: "Hendra Wijaya", email: "owner@harafina.com", role: "Owner" },
      { id: 3, name: "Rudi Hartono", email: "rudi@harafina.com", role: "Kasir" }
    ];

    // Cek apakah email sudah terdaftar
    const isEmailExist = existingUsers.some((u) => u.email === email);
    if (isEmailExist) {
      setErrorMsg("Email sudah terdaftar! Gunakan email lain.");
      return;
    }

    // Buat objek user baru
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      role: "Admin" // Default role sebagai Admin atau Kasir sesuai kebutuhan
    };

    // Simpan kembali ke localStorage agar terbaca di Menu User
    existingUsers.push(newUser);
    localStorage.setItem("users_data", JSON.stringify([...existingUsers, newUser]));

    // Berhasil Mendaftar
    setSuccessMsg("Registrasi berhasil! Mengalihkan ke halaman login...");
    alert("Registrasi berhasil! Silakan masuk dengan akun Anda.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-amber-900/5 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#3E2723]">Daftar Akun Baru</h2>
          <p className="text-sm text-amber-900/60 mt-1">
            Buat akun baru untuk mulai menggunakan sistem
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl text-center font-medium">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
              NAMA LENGKAP
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 absolute left-4 text-amber-900/40" />
              <input
                type="text"
                placeholder="Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-4 py-3 text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all"
              />
            </div>
          </div>

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
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-4 py-3 text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all"
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
                className="w-full bg-[#FAF8F5] border border-amber-900/10 rounded-2xl pl-12 pr-12 py-3 text-xs text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] transition-all"
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
            type="button"
            onClick={handleRegister}
            className="w-full bg-[#8D5B28] hover:bg-[#6D421E] text-white font-medium py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 cursor-pointer text-xs"
          >
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs text-amber-900/70 mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-[#8D5B28] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;