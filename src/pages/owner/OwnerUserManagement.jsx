import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, User, X, Lock, Unlock, ShieldAlert } from "lucide-react";

export default function OwnerUserManagement() {
  const [editingUser, setEditingUser] = useState(null);

  // Ambil data dari localStorage saat pertama kali dimuat
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users_data");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      { id: 1, name: "Admin Utama", email: "admin@harafina.com", role: "Admin", status: "Aktif" },
      { id: 2, name: "Hendra Wijaya (Owner)", email: "owner@harafina.com", role: "Owner", status: "Aktif" },
      { id: 3, name: "Siti Rahma", email: "kasir1@harafina.com", role: "Kasir / Staf", status: "Aktif" },
      { id: 4, name: "Rudi Hartono", email: "rudi@gmail.com", role: "Pelanggan", status: "Aktif" },
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
    role: "Admin",
    status: "Aktif",
  });

  // Fungsi penentu warna badge role
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Owner":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "Kasir / Staf":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Pelanggan":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Filter Data User berdasarkan Tab Role & Pencarian
  const filteredUsers = users.filter((u) => {
    const matchesTab = activeTab === "Semua" ? true : u.role === activeTab;
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Buka Modal Tambah User Baru
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Admin", status: "Aktif" });
    setIsModalOpen(true);
  };

  // Buka Modal Edit User (Mengubah Role / Detail Data)
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "Aktif",
    });
    setIsModalOpen(true);
  };

  // Handle Simpan User (Tambah Baru atau Update Perubahan)
  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Update data user & ubah role
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      // Tambah user baru
      setUsers([...users, { id: Date.now(), ...formData }]);
    }

    setFormData({ name: "", email: "", role: "Admin", status: "Aktif" });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  // Toggle Status Suspend / Aktifkan Akun (Kunci / Buka Akses Staf)
  const handleToggleStatus = (user) => {
    if (user.role === "Owner" && user.id === 2) {
      alert("Akun Owner utama tidak dapat dikunci / dinonaktifkan.");
      return;
    }

    const newStatus = user.status === "Nonaktif" ? "Aktif" : "Nonaktif";
    const confirmMsg =
      newStatus === "Nonaktif"
        ? `Apakah Anda yakin ingin MENGUNCI/SUSPEND akun ${user.name}? User ini tidak dapat melakukan login.`
        : `Aktifkan kembali akun ${user.name}?`;

    if (window.confirm(confirmMsg)) {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    }
  };

  // Hapus Permanen User
  const handleDelete = (user) => {
    if (user.role === "Owner" && user.id === 2) {
      alert("Akun Owner utama tidak dapat dihapus.");
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin MENGHAPUS PERMANEN user ${user.name} (${user.role})?`
      )
    ) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen User (Owner Portal)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Kelola pembuatan akun staf/admin/co-owner, ubah kewenangan role, serta suspen/kunci akun non-aktif.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah User Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
          />
        </div>

        <div className="flex flex-wrap bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto">
          {["Semua", "Admin", "Owner", "Kasir / Staf", "Pelanggan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EFEA] text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-6">NO</th>
                <th className="py-3.5 px-6">NAMA LENGKAP</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">ROLE HAK AKSES</th>
                <th className="py-3.5 px-6 text-center">STATUS AKUN</th>
                <th className="py-3.5 px-6 text-center">AKSI MANAJEMEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 text-gray-400 font-mono">{index + 1}</td>
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          <User size={15} />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold ${getRoleBadgeClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.status === "Nonaktif" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                          <Lock size={11} /> Kunci / Suspend
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
                          <Unlock size={11} /> Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Edit & Ubah Role */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit User & Ubah Role"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Suspend / Aktifkan Akses User */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === "Nonaktif"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                          title={
                            user.status === "Nonaktif"
                              ? "Buka Kunci Akses"
                              : "Kunci / Suspend Akun"
                          }
                        >
                          {user.status === "Nonaktif" ? (
                            <Unlock size={15} />
                          ) : (
                            <Lock size={15} />
                          )}
                        </button>

                        {/* Hapus User */}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Permanent User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Tidak ada data user yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit User & Ubah Role */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">
                {editingUser ? "Edit & Ubah Hak Akses User" : "Tambah User / Staf Baru"}
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
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
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
                  EMAIL SISTEM / LOGIN
                </label>
                <input
                  type="email"
                  placeholder="Contoh: budi@harafina.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
                  required
                />
              </div>

              {/* Pilihan Hak Akses Role Khusus Owner */}
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  ROLE (HAK AKSES KEWENANGAN)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#8D5B3A] font-semibold text-gray-700"
                >
                  <option value="Admin">Admin (Manajemen Toko)</option>
                  <option value="Kasir / Staf">Kasir / Staf Operasional</option>
                  <option value="Owner">Owner / Co-Owner (Pimpinan)</option>
                  <option value="Pelanggan">Pelanggan</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Sebagai Owner, Anda dapat memindahkan role staf ke Admin/Kasir sewaktu-waktu.
                </p>
              </div>

              {/* Pilihan Status Akun */}
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  STATUS AKUN
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#8D5B3A] font-semibold text-gray-700"
                >
                  <option value="Aktif">Aktif (Dapat Login)</option>
                  <option value="Nonaktif">Kunci / Suspend (Staf Resign)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white rounded-xl transition-colors cursor-pointer font-medium"
                >
                  {editingUser ? "Simpan Perubahan" : "Simpan User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}