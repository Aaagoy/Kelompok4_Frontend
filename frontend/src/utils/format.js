/**
 * Memformat angka menjadi format mata uang Rupiah (IDR)
 * @param {number} amount - Nilai angka
 * @returns {string} Contoh: Rp 15.000
 */
export const formatRupiah = (amount) => {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Memformat tanggal ke format lokal Indonesia
 * @param {string|Date} dateString - Tanggal yang akan diformat
 * @returns {string} Contoh: 06 Oktober 2026
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};