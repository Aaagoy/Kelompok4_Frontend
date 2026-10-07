import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("role", "admin");
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-amber-900/5 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#3E2723]">
            Masuk ke Harafina
          </h2>
          <p className="text-sm text-amber-900/60 mt-1">
            Silakan masukkan akun Anda untuk melanjutkan
          </p>
        </div>

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
            className="w-full bg-[#8D5B28] hover:bg-[#6D421E] text-white font-medium py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
