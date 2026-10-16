import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import {
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Clock,
  X,
  Store,
  Printer,
  TrendingUp,
  PackageCheck,
} from "lucide-react";

// Ubah format data BE (snake_case) ke format yang dipakai tampilan
const mapOrder = (o) => ({
  id: o.id,
  queueNumber: o.no_antrean,
  customerName: o.nama_pelanggan,
  date: o.waktu,
  paymentMethod: o.metode_pembayaran,
  totalAmount: Number(o.total_belanja),
  status: o.status,
  items: (o.items || []).map((i) => ({
    name: i.nama_barang,
    price: Number(i.harga),
    qty: Number(i.qty),
  })),
});

// Sesuai model Produk di BE: id_produk, nama_produk, harga, stok, id_kategori
const mapProduct = (p) => ({
  id: p.id_produk,
  nama: p.nama_produk ?? "-",
  harga: Number(p.harga ?? 0),
  stok: Number(p.stok ?? 0),
  kategori: p.kategori?.nama_kategori ?? p.kategori?.nama ?? "",
});

export default function OfflineOrders() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [orderStatus, setOrderStatus] = useState("Menunggu");
  const [cart, setCart] = useState([]);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);

  // Ambil produk & pesanan dari backend
  const fetchData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get("/produk"),
        api.get("/order"),
      ]);
      const prodList = prodRes.data?.data ?? prodRes.data;
      setProducts(Array.isArray(prodList) ? prodList.map(mapProduct) : []);
      setOrders((orderRes.data?.data ?? []).map(mapOrder));
    } catch (err) {
      alert(err, "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Metrik Statistik (khusus hari ini)
  const todayStr = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
  const todayOrders = orders.filter((o) => o.date.startsWith(todayStr));
  const totalOrdersToday = todayOrders.length;
  const activeQueueCount = orders.filter(
    (o) => o.status === "Menunggu" || o.status === "Proses",
  ).length;
  const totalOmzetToday = todayOrders
    .filter((o) => o.status === "Selesai")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Tambah produk ke keranjang dari grid pilihan
  const handleAddToCart = (product) => {
    if (product.stok <= 0) {
      alert("Stok produk ini habis! Tidak dapat dipesan.");
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id,
    );
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].qty < product.stok) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: updatedCart[existingIndex].qty + 1,
        };
        setCart(updatedCart);
      } else {
        alert(
          `Stok maksimal untuk ${product.nama} adalah ${product.stok} pcs.`,
        );
      }
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.nama,
          price: product.harga,
          qty: 1,
          maxStock: product.stok,
        },
      ]);
    }
  };

  // Ubah jumlah item di keranjang
  const handleUpdateQty = (productId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            if (newQty > item.maxStock) {
              alert(`Stok gudang hanya tersisa ${item.maxStock} pcs.`);
              return item;
            }
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const calculateCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Simpan Pesanan Baru -> POST ke backend
  const handleCheckoutOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang pesanan masih kosong!");
      return;
    }
    if (!customerName.trim()) {
      alert("Mohon masukkan nama pelanggan toko!");
      return;
    }

    setSubmitting(true);
    try {
      const { data: newOrder } = await api.post("/order", {
        nama_pelanggan: customerName,
        metode_pembayaran: paymentMethod,
        status: orderStatus,
        items: cart.map((i) => ({
          id_produk: i.productId,
          qty: i.qty,
        })),
      });

      await fetchData(); // refresh daftar pesanan & stok terbaru

      setIsModalOpen(false);
      setCustomerName("");
      setCart([]);
      setPaymentMethod("Tunai");
      setOrderStatus("Menunggu");

      setSelectedOrderForPrint(mapOrder(newOrder.data));
      setPrintModalOpen(true);
    } catch (err) {
      alert(err, "Gagal menyimpan pesanan");
      fetchData(); // stok mungkin berubah, sinkronkan ulang
    } finally {
      setSubmitting(false);
    }
  };

  // Ubah status pesanan -> PATCH ke backend (stok diurus di backend)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data: updatedOrder } = await api.patch(
        `/order/${orderId}/status`,
        { status: newStatus },
      );
      await fetchData();

      if (newStatus === "Selesai") {
        setSelectedOrderForPrint(mapOrder(updatedOrder.data));
        setPrintModalOpen(true);
      }
    } catch (err) {
      alert(err, "Gagal mengubah status");
      fetchData();
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm("Apakah Anda yakin ingin menghapus catatan pesanan ini?")
    )
      return;
    try {
      await api.delete(`/order/${orderId}`);
      await fetchData();
    } catch (err) {
      alert(err, "Gagal menghapus pesanan");
    }
  };

  const handleOpenPrintModal = (order) => {
    setSelectedOrderForPrint(order);
    setPrintModalOpen(true);
  };

  const handleExecutePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter(
    (o) =>
      String(o.id).includes(searchTerm) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.queueNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#8D5B3A] mb-1">
            <Store size={24} />
            <h1 className="text-2xl font-bold text-slate-900">
              Pesanan Offline & Antrean Toko
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Kelola nomor antrean, penyiapan barang dari gudang, dan kasir toko
            fisik Harafina.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Buat Pesanan & Ambil Antrean</span>
        </button>
      </div>

      {/* KARTU METRIK / STATISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Antrean Aktif (Menunggu / Proses)
            </p>
            <p className="text-xl font-bold text-slate-900">
              {activeQueueCount} Pelanggan
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <PackageCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Total Pesanan Hari Ini
            </p>
            <p className="text-xl font-bold text-slate-900">
              {totalOrdersToday} Transaksi
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Omzet Toko Fisik Hari Ini
            </p>
            <p className="text-xl font-bold text-emerald-700">
              Rp {totalOmzetToday.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Manajemen Pesanan & Antrean */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari No. Antrean, ID, atau Nama Pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
            />
          </div>
          <span className="text-sm text-slate-500 font-medium">
            Total Data:{" "}
            <strong className="text-slate-800">
              {filteredOrders.length} Antrean
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5EFEA] text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">No. Pesanan</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Pelanggan Toko</th>
                <th className="py-3.5 px-4">Rincian Item</th>
                <th className="py-3.5 px-4">Total Belanja</th>
                <th className="py-3.5 px-4">Pembayaran</th>
                <th className="py-3.5 px-4">Status & Ubah Status</th>
                <th className="py-3.5 px-6 text-right">Aksi / Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 font-mono font-extrabold text-[#8D5B3A] bg-[#8D5B3A]/10 rounded-lg">
                        {order.queueNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {order.date}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {order.customerName}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs space-y-0.5 max-w-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-slate-600 truncate">
                            • {item.name}{" "}
                            <span className="font-semibold">({item.qty}x)</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#8D5B3A]">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 cursor-pointer ${
                          order.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : order.status === "Proses"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Proses">Proses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenPrintModal(order)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Lihat & Cetak Struk"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Catatan"
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
                    Belum ada data antrean pesanan offline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT PESANAN & ANTREAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-[#8D5B3A]" size={20} />
                <h3 className="font-bold text-slate-900 text-lg">
                  Buat Pesanan Baru & Ambil Nomor Antrean
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCheckoutOrder} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Nama Pelanggan Toko
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Rina"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  >
                    <option value="Tunai">Tunai (Cash)</option>
                    <option value="QRIS">QRIS / Transfer</option>
                    <option value="Debit Card">Kartu Debit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D5B3A]/20 focus:border-[#8D5B3A]"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai (Langsung Bayar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Pilih Produk Bahan Kue (Klik untuk Tambah ke Keranjang)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className={`p-3 bg-white rounded-xl border cursor-pointer transition hover:border-[#8D5B3A] shadow-2xs flex flex-col justify-between ${
                        p.stok <= 0
                          ? "opacity-50 bg-slate-100 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-xs text-slate-800 line-clamp-1">
                          {p.nama}
                        </p>
                        <p className="text-[11px] text-[#8D5B3A] font-bold mt-0.5">
                          Rp {p.harga.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[10px]">
                        <span
                          className={`font-semibold ${
                            p.stok > 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          Stok: {p.stok}
                        </span>
                        <span className="text-slate-400">{p.kategori}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Keranjang Pesanan Kasir
                </label>
                {cart.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Produk</th>
                          <th className="py-2.5 px-3">Harga Satuan</th>
                          <th className="py-2.5 px-3 text-center">Jumlah</th>
                          <th className="py-2.5 px-3 text-right">Subtotal</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cart.map((item) => (
                          <tr
                            key={item.productId}
                            className="hover:bg-slate-50"
                          >
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {item.name}
                            </td>
                            <td className="py-2.5 px-3">
                              Rp {item.price.toLocaleString("id-ID")}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex items-center gap-2 border border-slate-200 rounded-xl px-2 py-0.5 bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQty(item.productId, -1)
                                  }
                                  className="text-slate-500 font-bold hover:text-slate-800"
                                >
                                  -
                                </button>
                                <span className="font-bold w-4 text-center">
                                  {item.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQty(item.productId, 1)
                                  }
                                  className="text-slate-500 font-bold hover:text-slate-800"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                              Rp{" "}
                              {(item.price * item.qty).toLocaleString("id-ID")}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQty(item.productId, -item.qty)
                                }
                                className="text-rose-600 hover:text-rose-800 font-medium"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="bg-[#F5EFEA] p-3.5 flex justify-between items-center border-t border-slate-200">
                      <span className="font-bold text-slate-700 text-sm">
                        Total Pembayaran:
                      </span>
                      <span className="font-extrabold text-[#8D5B3A] text-lg">
                        Rp {calculateCartTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                    Belum ada produk yang dipilih. Silakan klik produk di atas
                    untuk memasukkannya ke keranjang.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#8D5B3A] hover:bg-[#6D4227] rounded-xl shadow-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Menyimpan..."
                    : "Simpan Pesanan & Ambil Antrean"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL PREVIEW & CETAK STRUK */}
      {printModalOpen && selectedOrderForPrint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Printer size={18} className="text-[#8D5B3A]" /> Preview Struk &
                Nomor Antrean
              </h3>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-2 mb-6">
              <div className="text-center font-bold text-sm text-slate-900">
                TOKO BAHAN KUE HARAFINA
              </div>
              <div className="text-center text-[10px] text-slate-500">
                Jl. Toko Fisik No. 45, Padang
              </div>
              <div className="border-t border-dashed border-slate-300 my-2"></div>
              <div className="flex justify-between">
                <span>No. Antrean:</span>
                <span className="font-bold text-sm text-[#8D5B3A]">
                  {selectedOrderForPrint.queueNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{selectedOrderForPrint.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-bold">
                  {selectedOrderForPrint.customerName}
                </span>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2"></div>
              <div className="space-y-1">
                {selectedOrderForPrint.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-slate-700"
                  >
                    <span>
                      {item.name} ({item.qty}x)
                    </span>
                    <span>
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-300 my-2"></div>
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>TOTAL:</span>
                <span className="text-[#8D5B3A]">
                  Rp {selectedOrderForPrint.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pembayaran:</span>
                <span>{selectedOrderForPrint.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="font-semibold">
                  {selectedOrderForPrint.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleExecutePrint}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#8D5B3A] hover:bg-[#6D4227] rounded-xl shadow-sm transition cursor-pointer"
              >
                <Printer size={15} /> Cetak Fisik Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
