import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  FolderTree,
  Layers,
} from "lucide-react";
import api from "../../services/api";

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState("kategori");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [kategoriRes, subkategoriRes] = await Promise.all([
        api.get("/kategori/kategori"),
        // api.get("/subkategori"),
      ]);

      setCategories(
        (kategoriRes.data.data ?? kategoriRes.data).map((item) => ({
          ...item,
          id: item.id_kategori ?? item.id,
          nama: item.nama_kategori ?? item.nama,
          deskripsi: item.deskripsi ?? "",
        })),
      );

      setSubCategories(
        (subkategoriRes.data.data ?? subkategoriRes.data).map((item) => ({
          ...item,
          id: item.id_subkategori ?? item.id,
          kategoriId: item.id_kategori ?? item.kategoriId,
          nama: item.nama_subkategori ?? item.nama,
          deskripsi: item.deskripsi ?? "",
        })),
      );
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search & Modal States
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    kategoriId: "",
    deskripsi: "",
  });

  // Filter Kategori
  const filteredCategories = categories.filter(
    (c) =>
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter Sub-Kategori
  const filteredSubCategories = subCategories.filter((sc) => {
    const parentCat = categories.find((c) => c.id === Number(sc.kategoriId));
    const parentName = parentCat ? parentCat.nama : "";
    return (
      sc.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) return;

    try {
      if (activeTab === "kategori") {
        const payload = {
          nama_kategori: formData.nama,
          deskripsi: formData.deskripsi,
        };

        if (editingId) {
          await api.put(`/kategori${editingId}`, payload);
        } else {
          await api.post("/kategori", payload);
        }
      } else {
        if (!formData.kategoriId) return;

        const payload = {
          id_kategori: Number(formData.kategoriId),
          nama_subkategori: formData.nama,
          deskripsi: formData.deskripsi,
        };

        if (editingId) {
          await api.put(`/subkategori/${editingId}`, payload);
        } else {
          await api.post("/subkategori", payload);
        }
      }

      await fetchData();
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: "",
      kategoriId: categories[0]?.id || "",
      deskripsi: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    if (activeTab === "kategori") {
      setFormData({
        nama: item.nama,
        kategoriId: "",
        deskripsi: item.deskripsi,
      });
    } else {
      setFormData({
        nama: item.nama,
        kategoriId: item.kategoriId,
        deskripsi: item.deskripsi,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nama: "", kategoriId: "", deskripsi: "" });
  };

  const handleDelete = async (id) => {
    const message =
      activeTab === "kategori"
        ? "Menghapus kategori utama dapat memengaruhi sub-kategori terkait. Lanjutkan?"
        : "Apakah Anda yakin ingin menghapus sub-kategori ini?";

    if (!window.confirm(message)) return;

    try {
      if (activeTab === "kategori") {
        await api.delete(`/kategori/${id}`);
        // } else {
        //   await api.delete(`/subkategori/${id}`);
      }

      await fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menghapus data.");
    }
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manajemen Kategori & Sub-Kategori
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola struktur kategori dan sub-kategori produk Toko Harafina.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} />
          {activeTab === "kategori" ? "Tambah Kategori" : "Tambah Sub-Kategori"}
        </button>
      </div>

      {/* Tab Navigasi Kategori / Sub-Kategori */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveTab("kategori");
            setSearchTerm("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "kategori"
              ? "bg-[#8D5B3A] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FolderTree size={16} />
          <span>Kategori Utama ({categories.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("subkategori");
            setSearchTerm("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "subkategori"
              ? "bg-[#8D5B3A] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Layers size={16} />
          <span>Sub-Kategori ({subCategories.length})</span>
        </button>
      </div>

      {/* Konten Utama Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Search & Counter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={
                activeTab === "kategori"
                  ? "Cari kategori atau deskripsi..."
                  : "Cari sub-kategori atau kategori induk..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A] transition"
            />
          </div>
          <span className="text-sm text-slate-500 font-medium self-end sm:self-center">
            Total:{" "}
            <strong className="text-slate-800">
              {activeTab === "kategori"
                ? filteredCategories.length
                : filteredSubCategories.length}{" "}
              data
            </strong>
          </span>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : activeTab === "kategori" ? (
            // {activeTab === "kategori" ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">No</th>
                  <th className="py-3.5 px-4">Nama Kategori</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <FolderTree size={16} className="text-[#8D5B3A]" />
                        {item.nama}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {item.deskripsi || "-"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      Tidak ada kategori ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">No</th>
                  <th className="py-3.5 px-4">Nama Sub-Kategori</th>
                  <th className="py-3.5 px-4">Kategori Induk</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map((item, index) => {
                    const parentCat = categories.find(
                      (c) => c.id === Number(item.kategoriId),
                    );
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-4 px-6 text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <Layers size={16} className="text-[#8D5B3A]" />
                          {item.nama}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {parentCat ? parentCat.nama : "Tidak Diketahui"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {item.deskripsi || "-"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Tidak ada sub-kategori ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT KATEGORI & SUB-KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? "Edit" : "Tambah"}{" "}
                {activeTab === "kategori" ? "Kategori Utama" : "Sub-Kategori"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "subkategori" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Pilih Kategori Induk
                  </label>
                  <select
                    value={formData.kategoriId}
                    onChange={(e) =>
                      setFormData({ ...formData, kategoriId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                    required
                  >
                    <option value="" disabled>
                      -- Pilih Kategori Utama --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama {activeTab === "kategori" ? "Kategori" : "Sub-Kategori"}
                </label>
                <input
                  type="text"
                  placeholder={
                    activeTab === "kategori"
                      ? "Contoh: Minuman & Herbal"
                      : "Contoh: Kopi Bubuk"
                  }
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  placeholder="Keterangan singkat mengenai kelompok produk..."
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8D5B3A] hover:bg-[#6D4227] rounded-xl shadow-sm transition"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
