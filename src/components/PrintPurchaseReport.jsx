import React from "react";
import { Printer, X } from "lucide-react";

export default function PrintPurchaseReport({ 
  isOpen, 
  onClose, 
  purchases, 
  totalExpense, 
  title = "Laporan Pembelian (Restock)" // Default title
}) {
  if (!isOpen) return null;

  const handlePrintDocument = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Toolbar Header Preview (Sembunyi saat dicetak) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center print:hidden">
          <div>
            <h3 className="font-bold text-sm">Preview Dokumen: {title}</h3>
            <p className="text-xs text-slate-400">Format dokumen standar industri siap cetak / PDF</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintDocument}
              className="flex items-center gap-2 bg-[#8D5B3A] hover:bg-[#6D4227] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Printer size={16} /> Cetak / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* AREA LEMBAR DOKUMEN CETAK RESMI */}
        <div id="printable-purchase-document" className="p-8 sm:p-12 bg-white text-slate-800 text-xs font-serif leading-relaxed">
          
          {/* KOP SURAT / KOP TOKO */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-wide text-slate-900 font-sans">
                HARAFINA Bahan Kue dan Dapur
              </h1>
              <p className="text-[11px] text-slate-600 font-sans">
                Sistem Manajemen Toko & Pengadaan Bahan Baku Internal
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Jl. Utama Harafina No. 12, Padang, Sumatera Barat | Telp: (0751) 123456
              </p>
            </div>
            <div className="text-right font-sans">
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-300 rounded text-[10px] font-bold text-amber-800 uppercase">
                {title}
              </span>
              <p className="text-[10px] text-slate-500 mt-2">
                No. Dokumen: <span className="font-mono font-semibold">REP-PUR/{new Date().getFullYear()}/001</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Tanggal Cetak: {currentDate}
              </p>
            </div>
          </div>

          {/* INFORMASI RINGKASAN */}
          <div className="grid grid-cols-2 gap-4 mb-6 font-sans bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total Transaksi Masuk:</p>
              <p className="text-xs font-semibold text-slate-800">
                {purchases.length} Purchase Order (PO)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Status Laporan:</p>
              <p className="text-xs font-semibold text-slate-800">Resmi / Tervalidasi Sistem</p>
            </div>
          </div>

          {/* TABEL DATA PEMBELIAN */}
          <div className="mb-6 overflow-hidden">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-800 text-white font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 border border-slate-800 w-12 text-center">NO</th>
                  <th className="py-2.5 px-3 border border-slate-800">NO. INVOICE</th>
                  <th className="py-2.5 px-3 border border-slate-800">TANGGAL</th>
                  <th className="py-2.5 px-3 border border-slate-800">SUPPLIER / VENDOR</th>
                  <th className="py-2.5 px-3 border border-slate-800">NAMA BARANG</th>
                  <th className="py-2.5 px-3 border border-slate-800 text-center">JUMLAH</th>
                  <th className="py-2.5 px-3 border border-slate-800 text-right">TOTAL BIAYA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {purchases.length > 0 ? (
                  purchases.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-slate-200">
                      <td className="py-2 px-3 border border-slate-200 text-center font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 font-mono font-semibold">
                        {item.invoice || "-"}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-600">
                        {item.date || "-"}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 font-semibold text-slate-900">
                        {item.supplier || "-"}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-slate-600">
                        {item.itemsName || "-"}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center font-mono">
                        {item.qty || 0} pcs
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                        Rp {(Number(item.totalCost) || 0).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-slate-400 italic border border-slate-200">
                      Tidak ada data riwayat pembelian pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-800">
                  <td colSpan="6" className="py-3 px-3 text-right uppercase text-[11px] border border-slate-200">
                    TOTAL KESELURUHAN PENGELUARAN (MODAL RESTOCK):
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-rose-700 border border-slate-200">
                    Rp {(Number(totalExpense) || 0).toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* LEMBAR PENGESAHAN & TANDA TANGAN */}
          <div className="mt-12 pt-6 font-sans text-xs">
            <div className="flex justify-between items-end">
              <div className="text-center w-48">
                <p className="text-slate-500 text-[11px]">Dibuat Oleh,</p>
                <p className="font-bold text-slate-800 mt-1">Staf Logistik / Admin</p>
                <div className="h-16"></div>
                <p className="font-semibold text-slate-900 border-t border-slate-400 pt-1">( Admin Harafina )</p>
              </div>

              <div className="text-center w-48">
                <p className="text-slate-500 text-[11px]">Padang, {currentDate}</p>
                <p className="font-bold text-slate-800 mt-1">Disetujui Oleh,</p>
                <div className="h-16"></div>
                <p className="font-semibold text-slate-900 border-t border-slate-400 pt-1">( Owner / Pimpinan )</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-purchase-document, #printable-purchase-document * {
            visibility: visible;
          }
          #printable-purchase-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}