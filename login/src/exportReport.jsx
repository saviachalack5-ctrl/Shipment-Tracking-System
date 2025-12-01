import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FileSpreadsheet, Download } from "lucide-react";


const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const ExportReport = ({ data, columns, fileName = "report", exportTargetId }) => {

  const exportExcel = () => {
    const sheetData = [
      columns.map((col) => col.label),
      ...data.map((item) => columns.map((col) => item[col.field] ?? "")),
    ];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };


  const exportPDF = async () => {
    const element = document.querySelector(`#${exportTargetId}`);

    if (!element) {
      alert("Shipment area not found!");
      return;
    }


    const hiddenElements = document.querySelectorAll(".no-export");
    hiddenElements.forEach((el) => (el.style.display = "none"));


    const headerImg = new Image();
    headerImg.src = "/shipment.png"; 
    await new Promise((resolve) => (headerImg.onload = resolve));


    await new Promise((r) => setTimeout(r, 200));
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
    });


    hiddenElements.forEach((el) => (el.style.display = ""));

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 0;
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;


    const headerWidth = pageWidth;
    const headerHeight = (headerImg.height / headerImg.width) * headerWidth;
    pdf.addImage(headerImg, "PNG", 0, 0, headerWidth, headerHeight);


    pdf.setFontSize(10);
    pdf.text(`Date: ${today}`, pdf.internal.pageSize.getWidth() - 40, headerHeight - 8);


    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgY = headerHeight + 2; 
    pdf.addImage(imgData, "PNG", 0, imgY, imgWidth, imgHeight);

    pdf.save(`${fileName}.pdf`);
  };


  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button
      className="no-export"
        onClick={exportPDF}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "8px 14px",
          backgroundColor: "white",
          fontWeight: "500",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        <Download size={18} /> Export to PDF
      </button>

      <button
        className="no-export"
        onClick={exportExcel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "8px 14px",
          backgroundColor: "white",
          fontWeight: "500",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        <FileSpreadsheet size={18} /> Export to Excel
      </button>
    </div>
  );
};

export default ExportReport;
