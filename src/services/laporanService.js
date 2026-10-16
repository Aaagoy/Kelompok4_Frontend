import api from "./api";

// Laporan Penjualan -> { summary: { total_pendapatan, total_transaksi, rata_rata }, data: [...] }
export const fetchLaporanPenjualan = async ({
  tanggalMulai,
  tanggalSelesai,
  status,
} = {}) => {
  const params = {};
  if (tanggalMulai) params.tanggal_mulai = tanggalMulai;
  if (tanggalSelesai) params.tanggal_selesai = tanggalSelesai;
  if (status && status !== "Semua") params.status = status;

  const { data } = await api.get("/laporan", { params });
  return data;
};

export const fetchLaporanPembelian = async () => {
  const { data } = await api.get("/expense");
  return data;
};

export const fetchLaporanKeuangan = async ({ dari, sampai } = {}) => {
  const params = {};
  if (dari) params.dari = dari;
  if (sampai) params.sampai = sampai;

  const { data } = await api.get("/report", { params });
  return data;
};
