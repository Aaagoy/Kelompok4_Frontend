<<<<<<< HEAD
import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout"; // Sesuaikan path jika berbeda folder
import { Plus, Search, Pencil, Trash2, User, X } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@harafina.com", role: "Admin" },
    {
      id: 2,
      name: "Hendra Wijaya",
      email: "owner@harafina.com",
      role: "Owner",
    },
    {
      id: 3,
      name: "Rudi Hartono",
      email: "rudi@harafina.com",
      role: "Pelanggan",
    },
  ]);
=======
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; 
import { Plus, Search, Pencil, Trash2, User, X } from 'lucide-react';

export default function UserManagement() {
  // Ambil data dari localStorage saat pertama kali dimuat, jika kosong gunakan data default
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users_data');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      { id: 1, name: 'Admin', email: 'admin@harafina.com', role: 'Admin' },
      { id: 2, name: 'Hendra Wijaya', email: 'owner@harafina.com', role: 'Owner' },
      { id: 3, name: 'Rudi Hartono', email: 'rudi@harafina.com', role: 'Pelanggan' },
    ];
  });

  // Simpan ke localStorage setiap kali ada perubahan pada state users
  useEffect(() => {
    localStorage.setItem('users_data', JSON.stringify(users));
  }, [users]);
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd

  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
  });
=======
  
  // State untuk menyimpan data form & user yang sedang diedit (null jika mode tambah baru)
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Admin' });
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd

  // Fungsi untuk menentukan warna badge berdasarkan role
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-600";
      case "Owner":
        return "bg-purple-100 text-purple-600";
      case "Pelanggan":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesTab = activeTab === "Semua" ? true : u.role === activeTab;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Fungsi Buka Modal untuk Tambah Baru
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Admin' });
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal untuk Edit User
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  // Handle Submit (bisa untuk Tambah maupun Edit)
  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

<<<<<<< HEAD
    setUsers([...users, { id: Date.now(), ...formData }]);
    setFormData({ name: "", email: "", role: "Admin" });
=======
    if (editingUser) {
      // Mode Edit: Update user yang sesuai dengan ID
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      // Mode Tambah: Buat user baru
      setUsers([...users, { id: Date.now(), ...formData }]);
    }

    setFormData({ name: '', email: '', role: 'Admin' });
    setEditingUser(null);
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
          <p className="text-xs text-gray-400 mt-1">
            Kelola data pengguna, hak akses, dan status akun sistem.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors"
        >
          <Plus size={16} />
          <span>Tambah User</span>
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
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8D5B3A]"
          />
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto">
          {["Semua", "Admin", "Owner", "Pelanggan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
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
                <th className="py-3.5 px-6">NAMA</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6 text-center">AKSI</th>
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
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(user)} 
                          className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit User"
                        >
                          <Pencil size={15} />
                        </button>
<<<<<<< HEAD
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
                        >
=======
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors" title="Hapus User">
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    Tidak ada data user yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">
<<<<<<< HEAD
                Tambah User Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
=======
                {editingUser ? 'Edit Data User' : 'Tambah User Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
>>>>>>> 8b1827f577a688126d2918c455ebd745684cd1cd
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
                  EMAIL
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
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  ROLE
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#8D5B3A]"
                >
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                  <option value="Pelanggan">Pelanggan</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white rounded-xl transition-colors"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
