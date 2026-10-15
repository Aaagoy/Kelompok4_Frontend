import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Plus, Search, Pencil, Trash2, User, X, Lock, Unlock } from "lucide-react";

export default function UserManagement() {
  const [editingUser, setEditingUser] = useState(null);

  // Ambil data dari localStorage saat pertama kali dimuat
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users_data");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      { id: 1, name: "Admin Utama", email: "admin@harafina.com", role: "Admin", status: "Aktif" },
      { id: 2, name: "Hendra Wijaya", email: "owner@harafina.com", role: "Owner", status: "Aktif" },
      { id: 3, name: "Siti Rahma", email: "kasir@harafina.com", role: "Kasir / Staf", status: "Aktif" },
      { id: 4, name: "Rudi Hartono", email: "rudi@harafina.com", role: "Pelanggan", status: "Aktif" },
    ];
  });

  // Simpan ke localStorage setiap kali ada perubahan pada state users
  useEffect(() => {
    localStorage.setItem("users_data", JSON.stringify(users));
  }, [users]);

  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Kasir / Staf", // Admin dibatasi default membuat Kasir/Staf
    status: "Aktif",
  });

  // Fungsi untuk menentukan warna badge berdasarkan role
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-600";
      case "Owner":
        return "bg-purple-100 text-purple-600";
      case "Kasir / Staf":
        return "bg-amber-100 text-amber-700";
      case "Pelanggan":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesTab = activeTab === "Semua" ? true : u.role === activeTab;
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Fungsi Buka Modal untuk Tambah Kasir Baru
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Kasir / Staf", status: "Aktif" });
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal untuk Edit User (Restriksi: Admin tidak boleh edit Owner/Admin)
  const handleOpenEditModal = (user) => {
    if (user.role === "Owner" || user.role === "Admin") {
      alert("Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah akun Owner atau Admin lain.");
      return;
    }
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status || "Aktif" 
    });
    setIsModalOpen(true);
  };

  // Handle Submit (Tambah atau Edit Kasir)
  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      // Admin hanya bisa menambahkan Kasir/Staf baru
      setUsers([...users, { id: Date.now(), ...formData, role: "Kasir / Staf" }]);
    }

    setFormData({ name: "", email: "", role: "Kasir / Staf", status: "Aktif" });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  // Fungsi Suspend / Nonaktifkan Akun Kasir yang Resign
  const handleToggleStatus = (user) => {
    if (user.role === "Owner" || user.role === "Admin") {
      alert("Aksi Ditolak: Tidak dapat mengubah status akun Owner atau Admin.");
      return;
    }

    const newStatus = user.status === "Nonaktif" ? "Aktif" : "Nonaktif";
    const confirmMsg =
      newStatus === "Nonaktif"
        ? `Nonaktifkan akun kasir ${user.name}? Staf tidak akan bisa login.`
        : `Aktifkan kembali akun kasir ${user.name}?`;

    if (window.confirm(confirmMsg)) {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Staf Kasir (Admin Portal)</h2>
          <p className="text-xs text-gray-400 mt-1">
            Kelola data staf kasir, perbarui profil, dan kontrol status akses operasional harian.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Kasir Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau email kasir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
          />
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto">
          {["Semua", "Kasir / Staf", "Pelanggan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#8D5B3A] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EFEA] text-gray-600 font-bold uppercase">
              <tr>
                <th className="py-3.5 px-6">NO</th>
                <th className="py-3.5 px-6">NAMA KASIR / STAF</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6 text-center">STATUS AKUN</th>
                <th className="py-3.5 px-6 text-center">AKSI OPERASIONAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User size={16} />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold ${getRoleBadgeClass(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.status === "Nonaktif" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                          <Lock size={11} /> Nonaktif / Resign
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
                          <Unlock size={11} /> Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.role === "Owner" || user.role === "Admin" ? (
                        <span className="text-[11px] text-gray-400 italic">Dilindungi Sistem</span>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Profil Kasir"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              user.status === "Nonaktif"
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-amber-600 hover:bg-amber-50"
                            }`}
                            title={user.status === "Nonaktif" ? "Aktifkan Kembali" : "Nonaktifkan / Suspend"}
                          >
                            {user.status === "Nonaktif" ? <Unlock size={15} /> : <Lock size={15} />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
                    Tidak ada data user yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Kasir */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">
                {editingUser ? "Edit Profil Kasir / Staf" : "Tambah Kasir / Staf Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  NAMA LENGKAP KASIR
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Siti Rahma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="Contoh: kasir@harafina.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  ROLE (HAK AKSES)
                </label>
                <input
                  type="text"
                  value="Kasir / Staf"
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  *Admin hanya berwenang mengelola staf kasir operasional. Pembuatan akun Owner/Admin baru memerlukan otorisasi Owner.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white rounded-xl transition-colors cursor-pointer"
                >
                  {editingUser ? "Simpan Perubahan" : "Simpan Kasir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}