// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MessageCircle, MapPin } from 'lucide-react';

// const Homepage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('All');

//   // Data Kategori
//   const categories = [
//     { name: 'Gula', image: 'https://placehold.co/300x200?text=Gula' },
//     { name: 'Tepung', image: 'https://placehold.co/300x200?text=Tepung' },
//     { name: 'Pengembang', image: 'https://placehold.co/300x200?text=Pengembang' },
//   ];

//   // Data Produk
//   const products = [
//     { id: 1, name: 'Gula Semut', price: 'Rp 20.000', image: 'https://placehold.co/200x200?text=Gula+Semut' },
//     { id: 2, name: 'Tepung Bird Brand', price: 'Rp 25.000', image: 'https://placehold.co/200x200?text=Tepung+Bird+Brand' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
//       {/* NAVBAR */}
//       <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-xs">
//         <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
//           <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-xs">
//             H
//           </div>
//           <span className="font-bold text-lg text-gray-900 tracking-tight">Harafina</span>
//         </div>

//         <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
//           <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
//           <a href="#category" className="hover:text-indigo-600 transition-colors">Category</a>
//           <a href="#product" className="hover:text-indigo-600 transition-colors">Product</a>
//           <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
//         </div>

//         <button
//           onClick={() => navigate('/login')}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm"
//         >
//           Login
//         </button>
//       </nav>

//       <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
//         {/* BANNER PROMO */}
//         <section id="home" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
//           <div className="w-full md:w-1/2 flex justify-center">
//             <img
//               src="https://placehold.co/400x250?text=Promo+Bahan+Kue"
//               alt="Promo"
//               className="rounded-2xl object-cover"
//             />
//           </div>
//           <div className="w-full md:w-1/2 space-y-4">
//             <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
//               PROMO TERBATAS
//             </span>
//             <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
//               Penawaran Spesial Bulan Ini!
//             </h1>
//             <p className="text-sm text-gray-500 leading-relaxed">
//               Dapatkan diskon eksklusif hingga 50% untuk koleksi produk pilihan. Nikmati pengiriman cepat dan kualitas produk terbaik langsung ke lokasi Anda.
//             </p>
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md text-sm">
//               Lihat Promo Sekarang
//             </button>
//           </div>
//         </section>

//         {/* KATEGORI PILIHAN */}
//         <section id="category" className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-900">Kategori Pilihan</h2>
//             <button className="text-xs font-semibold text-indigo-600 hover:underline">Lihat Semua</button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {categories.map((cat, idx) => (
//               <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
//                 <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
//                 <div className="p-4 text-center font-bold text-gray-800">
//                   {cat.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* DAFTAR PRODUK */}
//         <section id="product" className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-900">Daftar Produk</h2>
//             <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold gap-1">
//               {['All', 'Populer', 'Terbaru'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-1.5 rounded-lg transition-all ${
//                     activeTab === tab ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {products.map((prod) => (
//               <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs space-y-3">
//                 <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded-xl" />
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-800">{prod.name}</h3>
//                   <p className="text-sm font-bold text-indigo-600 mt-1">{prod.price}</p>
//                 </div>
//                 <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all">
//                   Beli
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* LOKASI DAN KONTAK */}
//         <section id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* MAPS */}
//           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
//             <div>
//               <h3 className="font-bold text-gray-900 text-base">Lokasi Kami (Maps)</h3>
//               <p className="text-xs text-gray-500 mt-1">Temukan toko fisik kami melalui peta di bawah ini.</p>
//             </div>
//             <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden relative">
//               <iframe
//                 title="Google Maps"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.3102111197945!2d100.3685!3d-0.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMDAuMCJTIDEwMMKwMjInMDYuNiJF!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid"
//                 className="w-full h-full border-0"
//                 allowFullScreen=""
//                 loading="lazy"
//               ></iframe>
//             </div>
//           </div>

//           {/* CONTACT WA */}
//           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between space-y-4">
//             <div>
//               <h3 className="font-bold text-gray-900 text-base">Contact WA</h3>
//               <p className="text-xs text-gray-500 mt-1">
//                 Ada pertanyaan atau butuh bantuan pemesanan? Hubungi customer service kami langsung melalui WhatsApp.
//               </p>
//               <div className="mt-4 space-y-2 text-xs text-gray-600">
//                 <p><span className="font-bold text-gray-800">Alamat:</span> Jl. Thamrin, Ganting Parak Gadang, Kec. Padang Tim., Kota Padang, Sumatera Barat 25133</p>
//                 <p><span className="font-bold text-gray-800">Jam Operasional:</span> Senin - Sabtu (08:00 - 17:00 WIB)</p>
//               </div>
//             </div>

//             <a
//               href="https://wa.me/6281234567890"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
//             >
//               <MessageCircle className="w-4 h-4" />
//               <span>Chat via WhatsApp</span>
//             </a>
//           </div>
//         </section>
//       </div>

//       {/* FOOTER */}
//       <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
//         © 2026 Toko Bahan Kue Harafina. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Homepage;

import { useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    {
      id: 1,
      name: "Gula",
      image: "/gula_semut.jpeg",
    },
    {
      id: 2,
      name: "Tepung",
      image: "/tepung_super_brand.jpeg",
    },
    {
      id: 3,
      name: "Pengembang",
      image: "/fermipan.jpg",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Gula Semut",
      price: "Rp 20.000",
      image: "/gula_semut.jpeg",
    },
    {
      id: 2,
      name: "Tepung Bird Brand",
      price: "Rp 25.000",
      image: "/tepung_bird_brand.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. NAVBAR HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-13 h-13 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="logo"
                className="w-[90px] h-[90px] object-cover"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a
              href="#category"
              className="hover:text-indigo-600 transition-colors"
            >
              Category
            </a>
            <a
              href="#product"
              className="hover:text-indigo-600 transition-colors"
            >
              Product
            </a>
            <a
              href="#contact"
              className="hover:text-indigo-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          <a
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            Login
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* 2. HERO / PENAWARAN SECTION */}
        <section
          id="home"
          className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-xl overflow-hidden relative shadow-inner">
            <img
              src="/paket.jpg"
              alt="Penawaran Spesial"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full">
              Promo Terbatas
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Penawaran Spesial Bulan Ini!
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              Dapatkan diskon eksklusif hingga 50% untuk koleksi produk pilihan.
              Nikmati pengiriman cepat dan kualitas produk terbaik langsung ke
              lokasi Anda.
            </p>
            <div className="pt-2">
              <a
                href="#product"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Lihat Promo Sekarang
              </a>
            </div>
          </div>
        </section>

        {/* 3. CATEGORY SECTION */}
        <section id="category" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Kategori Pilihan
            </h2>
            <span className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">
              Lihat Semua
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 bg-white text-center">
                  <h3 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PRODUCT SECTION */}
        <section id="product" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Daftar Produk</h2>
            <div className="flex space-x-2">
              {["All", "Populer", "Terbaru"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeCategory === tab
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4 flex flex-col justify-between">
                  <h4 className="font-medium text-slate-800 text-sm line-clamp-2 mb-2">
                    {prod.name}
                  </h4>
                  <div>
                    <p className="text-indigo-600 font-bold text-base">
                      {prod.price}
                    </p>
                    <button className="mt-3 w-full py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md transition-colors">
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FOOTER / CONTACT & MAPS SECTION */}
        <section
          id="contact"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Lokasi Kami (Maps)
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Temukan toko fisik kami melalui peta di bawah ini.
              </p>
            </div>
            <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.32890013705259!2d100.3701791514731!3d-0.9564704118292529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942cc13febf%3A0x3ad43f63bb161be0!2sBuyung%20Motor!5e0!3m2!1sid!2sid!4v1791185653969!5m2!1sid!2sid"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Contact WA
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Ada pertanyaan atau butuh bantuan pemesanan? Hubungi customer
                service kami langsung melalui WhatsApp.
              </p>

              <div className="space-y-3 text-sm text-slate-600 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-800">Alamat:</span>
                  <span>
                    29VC+C5V, Jl. Thamrin, Ganting Parak Gadang, Kec. Padang
                    Tim., Kota Padang, Sumatera Barat 25133
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-slate-800">
                    Jam Operasional:
                  </span>
                  <span>Senin - Sabtu (08:00 - 17:00 WIB)</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890?text=Halo%20admin,%20saya%20ingin%20bertanya%20mengenai%20produk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-center shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 0C5.396 0 .029 5.367.029 12.003c0 2.122.554 4.192 1.606 6.012L0 24l6.141-1.611a11.96 11.96 0 005.89 1.517h.005c6.632 0 12-5.367 12-12.003C24.036 5.367 18.663 0 12.031 0zm0 22.003c-1.802 0-3.567-.484-5.116-1.401l-.367-.218-3.649.957.974-3.557-.239-.38a9.98 9.98 0 01-1.534-5.399c0-5.518 4.49-10.008 10.01-10.008 5.517 0 10.007 4.49 10.007 10.008 0 5.519-4.49 10.008-10.006 10.008z" />
              </svg>
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} NEW YORK Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
