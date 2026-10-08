import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Building2,
  Phone,
  MapPin,
} from "lucide-react";

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem("suppliers_data");
    if (savedSuppliers) {
      return JSON.parse(savedSuppliers);
    }
    return [
      {
        id_supplier: 1,
        nama_supplier: 'PT Sumber Pangan Nusantara',
        alamat_supplier: 'Jl. Raya Industri No. 45, Jakarta',
        notelp_supplier: '081234567890',
      },
      {
        id_supplier: 2,
        nama_supplier: 'CV Berkah Jaya Mandiri',
        alamat_supplier: 'Jl. Ahmad Yani No. 12, Padang',
        notelp_supplier: '085277889900',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("suppliers_data", JSON.stringify(suppliers));
  }, [suppliers]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nama_supplier: '',
    alamat_supplier: '',
    notelp_supplier: '',
  });

  // Filter pencarian supplier
  const filteredSuppliers = suppliers.filter(item =>
    item.nama_supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat_supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notelp_supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      nama_supplier: '',
      alamat_supplier: '',
      notelp_supplier: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setEditingId(supplier.id_supplier);
    setFormData({
      nama_supplier: supplier.nama_supplier || '',
      alamat_supplier: supplier.alamat_supplier || '',
      notelp_supplier: supplier.notelp_supplier || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_supplier || !formData.notelp_supplier) return;

    if (editingId !== null) {
      // Edit data
      setSuppliers(
        suppliers.map((s) =>
          s.id_supplier === editingId
            ? { ...s, ...formData }
            : s
        )
      );
    } else {
      // Tambah data baru
      const newSupplier = {
        id_supplier: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id_supplier)) + 1 : 1,
        ...formData,
      };
      setSuppliers([...suppliers, newSupplier]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data supplier ini?")) {
      setSuppliers(suppliers.filter((s) => s.id_supplier !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Supplier</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar vendor, informasi kontak, dan alamat supplier barang.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} />
          Tambah Supplier
        </button>
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
              placeholder="Cari nama, alamat, atau no telp supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A] transition"
            />
          </div>
          <span className="text-sm text-slate-500 font-medium self-end sm:self-center">
            Total Supplier:{" "}
            <strong className="text-slate-800">
              {filteredSuppliers.length} vendor
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-4">Nama Supplier</th>
                <th className="py-3.5 px-4">Alamat Supplier</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((item) => (
                  <tr key={item.id_supplier} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-500">
                      #{item.id_supplier}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-[#8D5B3A]" />
                        {item.nama_supplier}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{item.alamat_supplier || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-xs">{item.notelp_supplier || '-'}</span>
                      </div>
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
                          onClick={() => handleDelete(item.id_supplier)}
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
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada data supplier yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT SUPPLIER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId !== null ? "Edit Data Supplier" : "Tambah Supplier Baru"}
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
                  Nama Supplier
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Sumber Pangan"
                  value={formData.nama_supplier}
                  onChange={(e) => setFormData({ ...formData, nama_supplier: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Alamat Supplier
                </label>
                <textarea
                  placeholder="Masukkan alamat lengkap..."
                  value={formData.alamat_supplier}
                  onChange={(e) => setFormData({ ...formData, alamat_supplier: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.notelp_supplier}
                  onChange={(e) => setFormData({ ...formData, notelp_supplier: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  required
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
                  {editingId !== null ? "Simpan Perubahan" : "Simpan Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}