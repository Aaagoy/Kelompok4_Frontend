import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products_data");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return [
      {
        id: 1,
        sku: 'SKU-001',
        nama: 'Gula Semut Organik',
        kategori: 'Pemanis & Gula',
        harga: 25000,
        stok: 45,
        expiryDate: '2026-12-31',
        deskripsi: 'Gula semut murni berkualitas tinggi dari nira kelapa pilihan.',
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 2,
        sku: 'SKU-002',
        nama: 'Tepung Super Brand',
        kategori: 'Tepung & Biji-bijian',
        harga: 15000,
        stok: 8,
        expiryDate: '2026-10-31',
        deskripsi: 'Tepung terigu protein sedang cocok untuk aneka kue.',
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 3,
        sku: 'SKU-003',
        nama: 'Ragi Fermipan Instan',
        kategori: 'Bahan Roti & Kue',
        harga: 7500,
        stok: 0,
        expiryDate: '2026-10-08',
        deskripsi: 'Ragi instan aktif untuk mengembangkan adonan roti dengan cepat.',
        image: 'https://via.placeholder.com/50'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("products_data", JSON.stringify(products));
  }, [products]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    sku: '',
    nama: '',
    kategori: '',
    harga: '',
    stok: '',
    expiryDate: '',
    deskripsi: '',
  });

  // Ambil pilihan kategori secara dinamis dari localStorage (terhubung ke CategoryManagement)
  const getCategoryOptions = () => {
    const savedCategories = localStorage.getItem("categories_data");
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      return parsed.map(cat => cat.nama);
    }
    // Fallback default jika localStorage kategori kosong
    return [
      "Pemanis & Gula",
      "Tepung & Biji-bijian",
      "Bahan Roti & Kue",
    ];
  };

  const renderStatusBadge = (stok) => {
    if (stok > 10) {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
          Tersedia
        </span>
      );
    } else if (stok > 0) {
      return (
        <span className="px-3.5 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
          Stok Menipis
        </span>
      );
    } else {
      return (
        <span className="px-3.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 rounded-full">
          Habis
        </span>
      );
    }
  };

  const checkExpiryStatus = (dateString) => {
    if (!dateString) return { status: 'safe', label: 'Tidak ada info' };

    const today = new Date();
    const expiry = new Date(dateString);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: 'Kadaluarsa!' };
    } else if (diffDays <= 30) {
      return { status: 'warning', label: `Segera Exp (${diffDays} hari)` };
    } else {
      return { status: 'safe', label: 'Aman' };
    }
  };

  const renderExpiryBadge = (dateString) => {
    const { status, label } = checkExpiryStatus(dateString);

    if (status === 'expired') {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 rounded-lg animate-pulse">
          ⚠️ {label}
        </span>
      );
    } else if (status === 'warning') {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 rounded-lg">
          ⚠️ {label}
        </span>
      );
    }
    return <span className="text-xs text-slate-400">{dateString || '-'}</span>;
  };

  const filteredProducts = products.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      sku: '',
      nama: '',
      kategori: '',
      harga: '',
      stok: '',
      expiryDate: '',
      deskripsi: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku || '',
      nama: product.nama || '',
      kategori: product.kategori || '',
      harga: product.harga || '',
      stok: product.stok || '',
      expiryDate: product.expiryDate || '',
      deskripsi: product.deskripsi || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.kategori) return;

    if (editingId !== null) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                sku: formData.sku || p.sku,
                nama: formData.nama,
                kategori: formData.kategori,
                harga: Number(formData.harga) || 0,
                stok: Number(formData.stok) || 0,
                expiryDate: formData.expiryDate,
                deskripsi: formData.deskripsi,
              }
            : p
        )
      );
    } else {
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        sku: formData.sku || `SKU-00${products.length + 1}`,
        nama: formData.nama,
        kategori: formData.kategori,
        harga: Number(formData.harga) || 0,
        stok: Number(formData.stok) || 0,
        expiryDate: formData.expiryDate,
        deskripsi: formData.deskripsi,
        image: 'https://via.placeholder.com/50'
      };
      setProducts([...products, newProduct]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ sku: '', nama: '', kategori: '', harga: '', stok: '', expiryDate: '', deskripsi: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar produk, SKU, harga, dan ketersediaan stok admin.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.removeItem("products_data");
              window.location.reload();
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl font-medium text-sm transition"
            title="Reset penyimpanan lokal jika data tidak muncul"
          >
            Reset Cache
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
          >
            <Plus size={18} />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/85 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama produk, kategori, atau SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A] transition"
            />
          </div>
          <span className="text-sm text-slate-500 font-medium self-end sm:self-center">
            Total:{" "}
            <strong className="text-slate-800">
              {filteredProducts.length} produk
            </strong>
          </span>
        </div>

        {products.some(p => checkExpiryStatus(p.expiryDate).status === 'expired') && (
          <div className="m-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
            <span>⚠️ <strong>Perhatian:</strong> Ada produk di inventaris yang telah melewati tanggal kadaluarsa. Mohon segera periksa dan tarik dari stok toko.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Kadaluarsa</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.nama}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{item.nama}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.deskripsi || 'Tidak ada deskripsi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-600">{item.sku}</td>
                    <td className="py-4 px-4 text-slate-600">{item.kategori}</td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {item.stok} pcs
                    </td>
                    <td className="py-4 px-4">
                      {renderExpiryBadge(item.expiryDate)}
                    </td>
                    <td className="py-4 px-4">
                      {renderStatusBadge(item.stok)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 text-slate-600">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId !== null ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SKU-004"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gula Semut"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              {/* KATEGORI LIST BOX DINAMIS DARI LOCALSTORAGE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                >
                  <option value="">-- Pilih Kategori Produk --</option>
                  {getCategoryOptions().map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({ ...formData, harga: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    placeholder="45"
                    value={formData.stok}
                    onChange={(e) =>
                      setFormData({ ...formData, stok: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tanggal Kadaluarsa (Expiry Date)
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  placeholder="Keterangan singkat mengenai produk..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8D5B3A] hover:bg-[#6D4227] rounded-xl shadow-sm transition"
                >
                  {editingId !== null ? "Simpan Perubahan" : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}