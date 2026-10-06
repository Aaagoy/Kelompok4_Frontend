import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  // Data Kategori
  const categories = [
    { name: 'Gula', image: 'https://placehold.co/300x200?text=Gula' },
    { name: 'Tepung', image: 'https://placehold.co/300x200?text=Tepung' },
    { name: 'Pengembang', image: 'https://placehold.co/300x200?text=Pengembang' },
  ];

  // Data Produk
  const products = [
    { id: 1, name: 'Gula Semut', price: 'Rp 20.000', image: 'https://placehold.co/200x200?text=Gula+Semut' },
    { id: 2, name: 'Tepung Bird Brand', price: 'Rp 25.000', image: 'https://placehold.co/200x200?text=Tepung+Bird+Brand' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-xs">
            H
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Harafina</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#category" className="hover:text-indigo-600 transition-colors">Category</a>
          <a href="#product" className="hover:text-indigo-600 transition-colors">Product</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm"
        >
          Login
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* BANNER PROMO */}
        <section id="home" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://placehold.co/400x250?text=Promo+Bahan+Kue"
              alt="Promo"
              className="rounded-2xl object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              PROMO TERBATAS
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Penawaran Spesial Bulan Ini!
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Dapatkan diskon eksklusif hingga 50% untuk koleksi produk pilihan. Nikmati pengiriman cepat dan kualitas produk terbaik langsung ke lokasi Anda.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md text-sm">
              Lihat Promo Sekarang
            </button>
          </div>
        </section>

        {/* KATEGORI PILIHAN */}
        <section id="category" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Kategori Pilihan</h2>
            <button className="text-xs font-semibold text-indigo-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
                <div className="p-4 text-center font-bold text-gray-800">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DAFTAR PRODUK */}
        <section id="product" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Daftar Produk</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold gap-1">
              {['All', 'Populer', 'Terbaru'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg transition-all ${
                    activeTab === tab ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs space-y-3">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded-xl" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{prod.name}</h3>
                  <p className="text-sm font-bold text-indigo-600 mt-1">{prod.price}</p>
                </div>
                <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all">
                  Beli
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* LOKASI DAN KONTAK */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MAPS */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Lokasi Kami (Maps)</h3>
              <p className="text-xs text-gray-500 mt-1">Temukan toko fisik kami melalui peta di bawah ini.</p>
            </div>
            <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden relative">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3102111197945!2d100.3685!3d-0.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMDAuMCJTIDEwMMKwMjInMDYuNiJF!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* CONTACT WA */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Contact WA</h3>
              <p className="text-xs text-gray-500 mt-1">
                Ada pertanyaan atau butuh bantuan pemesanan? Hubungi customer service kami langsung melalui WhatsApp.
              </p>
              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <p><span className="font-bold text-gray-800">Alamat:</span> Jl. Thamrin, Ganting Parak Gadang, Kec. Padang Tim., Kota Padang, Sumatera Barat 25133</p>
                <p><span className="font-bold text-gray-800">Jam Operasional:</span> Senin - Sabtu (08:00 - 17:00 WIB)</p>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © 2026 Toko Bahan Kue Harafina. All rights reserved.
      </footer>
    </div>
  );
};

export default Homepage;