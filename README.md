frontend/
├── public/                    # Aset statis publik (favicon, logo, dll.)
├── src/
│   ├── assets/                # Gambar, ilustrasi, atau ikon kustom
│   ├── components/            # Komponen modular yang dapat digunakan kembali (reusable)
│   │   ├── DashboardLayout.jsx # Layout utama khusus Admin & Owner (Sidebar + Header + Konten)
│   │   ├── DashboardNavbar.jsx # Navbar atas untuk area admin/owner (profil, tombol toggle sidebar, logout)
│   │   ├── Navbar.jsx          # Navbar publik untuk halaman utama/katalog (User)
│   │   ├── ProtectedRoute.jsx  # Komponen pengaman halaman berdasarkan role (admin/owner/user)
│   │   └── Sidebar.jsx         # Sidebar navigasi samping dengan menu lengkap
│   ├── pages/                 # Kumpulan halaman aplikasi
│   │   ├── Home.jsx           # Halaman utama / katalog produk untuk publik (User)
│   │   ├── Login.jsx          # Halaman login otentikasi (JWT)
│   │   ├── admin/             # Kumpulan halaman khusus Administrator
│   │   │   ├── AdminDashboard.jsx # Ringkasan statistik & operasional toko
│   │   │   ├── Kasir.jsx          # Fitur Point of Sale (POS) / kasir toko fisik
│   │   │   ├── Kategori.jsx       # Manajemen Kategori & Subkategori bahan kue
│   │   │   ├── Produk.jsx         # Manajemen data bahan kue (CRUD, stok, harga, foto)
│   │   │   ├── Riwayat.jsx        # Riwayat transaksi penjualan terdahulu
│   │   │   ├── Transaksi.jsx      # Pengelolaan transaksi atau pesanan masuk
│   │   │   └── UserManagement.jsx # Manajemen data staff / akun pengguna
│   │   └── owner/             # Kumpulan halaman khusus Pemilik Toko (Owner)
│   │       └── OwnerLaporan.jsx   # Laporan keuangan, rekap penjualan, dan stok komprehensif
│   ├── services/              # Layanan komunikasi dengan Backend API
│   │   └── api.js             # Konfigurasi Axios, Base URL, dan Interceptor JWT Token
│   ├── utils/                 # Fungsi helper / utilitas umum
│   │   └── format.js          # Helper untuk format mata uang Rupiah, tanggal, dll.
│   ├── App.jsx                # Konfigurasi utama React Router DOM (pengaturan rute URL)
│   ├── index.css              # File utama CSS yang memuat konfigurasi Tailwind CSS & DaisyUI
│   └── main.jsx               # Entry point aplikasi React (render ke DOM)
├── .env                       # Variabel lingkungan (contoh: VITE_API_BASE_URL)
├── index.html                 # Template HTML utama
├── package.json               # Daftar dependensi (React, Vite, Tailwind, DaisyUI, Lucide, dll.)
├── postcss.config.js          # Konfigurasi PostCSS untuk Tailwind CSS
└── tailwind.config.js         # Konfigurasi tema Tailwind & plugin DaisyUI