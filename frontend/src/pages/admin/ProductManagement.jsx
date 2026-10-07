import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout'; // Sesuaikan path folder jika berbeda
import { 
  Package, 
  ShoppingCart, 
  History, 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X 
} from 'lucide-react';

export default function ProductManagement() {
  // Ambil data awal dari localStorage jika ada, jika tidak pakai data dummy
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products_data');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return [
      {
        id: 1,
        nama: 'Gula Semut Organik',
        kategori: 'Pemanis & Gula',
        harga: 25000,
        stok: 45,
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 2,
        nama: 'Tepung Super Brand',
        kategori: 'Tepung & Biji-bijian',
        harga: 15000,
        stok: 8,
        image: 'https://via.placeholder.com/50'
      },
      {
        id: 3,
        nama: 'Ragi Fermipan Instan',
        kategori: 'Bahan Roti & Kue',
        harga: 7500,
        stok: 0,
        image: 'https://via.placeholder.com/50'
      }
    ];
  });

  // Simpan ke localStorage setiap kali ada perubahan pada state products
  useEffect(() => {
    localStorage.setItem('products_data', JSON.stringify(products));
  }, [products]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State untuk Tambah Produk
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    harga: '',
    stok: ''
  });

  // Fungsi Badge Status berdasarkan stok
  const renderStatusBadge = (stok) => {
    if (stok > 10) {
      return <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">Tersedia</span>;
    } else if (stok > 0) {
      return <span className="px-3.5 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">Stok Menipis</span>;
    } else {
      return <span className="px-3.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 rounded-full">Habis</span>;
    }
  };

  // Filter Search
  const filteredProducts = products.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.kategori) return;

    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      nama: formData.nama,
      kategori: formData.kategori,
      harga: Number(formData.harga) || 0,
      stok: Number(formData.stok) || 0,
      image: 'https://via.placeholder.com/50'
    };

    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    setFormData({ nama: '', kategori: '', harga: '', stok: '' });
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar produk, harga, dan ketersediaan stok admin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>

      {/* Card Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Top Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A] transition"
            />
          </div>
          <span className="text-sm text-slate-500 font-medium self-end sm:self-center">
            Total: <strong className="text-slate-800">{filteredProducts.length} produk</strong>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
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
                          <p className="text-xs text-slate-400">ID: #{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{item.kategori}</td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{item.stok} pcs</td>
                    <td className="py-4 px-4">{renderStatusBadge(item.stok)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 text-slate-600">
                        <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" title="Edit">
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
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-lg">Tambah Produk Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gula Semut"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pemanis & Gula"
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Harga (RP)
                  </label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}