// src/utils/exportUtils.js
import html2pdf from "html2pdf.js";

// Fungsi Cetak / Print Halaman Fisik
export const handlePrint = () => {
  window.print();
};

// Fungsi Ekspor ke CSV
export const handleExportCSV = (data, filename = "Laporan_Data") => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  const keys = Object.keys(data[0]);
  let csvContent = "data:text/csv;charset=utf-8," + keys.join(",") + "\r\n";

  data.forEach((item) => {
    const row = keys.map((key) => {
      let val = item[key] !== undefined && item[key] !== null ? item[key] : "";
      if (typeof val === "string") {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvContent += row.join(",") + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fungsi Ekspor ke Excel (.xls)
export const handleExportExcel = (data, filename = "Laporan_Data") => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  const keys = Object.keys(data[0]);

  let htmlTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"/></head>
    <body>
      <table border="1">
        <thead>
          <tr style="background-color: #F5EFEA; font-weight: bold;">
            ${keys.map((key) => `<th>${key.toUpperCase()}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((item) => {
    htmlTable += "<tr>";
    keys.forEach((key) => {
      htmlTable += `<td>${item[key] !== undefined && item[key] !== null ? item[key] : ""}</td>`;
    });
    htmlTable += "</tr>";
  });

  htmlTable += `</tbody></table></body></html>`;

  const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fungsi Ekspor Dokumen PDF Resmi (Menggunakan html2pdf.js berdasarkan ID Elemen)
export const handleExportPDF = (elementId, filename = "Dokumen_Laporan.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Area laporan untuk PDF tidak ditemukan!");
    return;
  }

  const options = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(element).set(options).save();
};