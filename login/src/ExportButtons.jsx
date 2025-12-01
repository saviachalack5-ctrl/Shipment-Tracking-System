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

const ExportButtons = ({
  data,
  columns,
  fileName = "Shipment_Report",
  exportTargetId,
}) => {
  const exportExcel = () => {
    const sheetData = [
      columns.map((col) => col.label),
      ...data.map((item) =>
        columns.map((col) => item[col.field] ?? "")
      ),
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const rowHeight = 8;

    let y;

    const headerImg = new Image();
    headerImg.src = "/shipment.png";
    await new Promise((r) => (headerImg.onload = r));

    const drawHeader = () => {
      const imgWidth = pageWidth;
      const imgHeight = (headerImg.height / headerImg.width) * imgWidth;

      pdf.addImage(headerImg, "PNG", 0, 0, imgWidth, imgHeight);


      pdf.setFontSize(10);
      pdf.text(`Date: ${today}`, pageWidth - 40, imgHeight - 8);

      return imgHeight; // return actual header height
    };


    let headerHeight = drawHeader();


    y = headerHeight + 10;

    pdf.setFontSize(11);
    let x = 10;
    columns.forEach((col) => {
      pdf.text(col.label, x, y);
      x += 35;
    });

    y += 8;

    pdf.setFontSize(10);

    for (let i = 0; i < data.length; i++) {
      if (y + rowHeight > pageHeight - 10) {
        pdf.addPage();
        headerHeight = drawHeader();
        y = headerHeight + 10;


        pdf.setFontSize(11);
        let xTitle = 10;
        columns.forEach((col) => {
          pdf.text(col.label, xTitle, y);
          xTitle += 35;
        });
        y += 8;
        pdf.setFontSize(10);
      }

      let xRow = 10;
      columns.forEach((col) => {
        pdf.text(String(data[i][col.field] ?? ""), xRow, y);
        xRow += 35;
      });

      y += rowHeight;
    }

    pdf.save(`${fileName}.pdf`);
  };


  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={exportPDF} style={buttonStyle}>
        <Download size={18} />
        Export PDF
      </button>

      <button onClick={exportExcel} style={buttonStyle}>
        <FileSpreadsheet size={18} />
        Export Excel
      </button>
    </div>
  );
};

const buttonStyle = {
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
};

export default ExportButtons;
