import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
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

    
    const drawHeader = () => {
      const headerTop = 15;
      
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(fileName.replace(/_/g, " "), 10, headerTop);

      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date: ${today}`, pageWidth - 45, headerTop);

      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(10, headerTop + 5, pageWidth - 10, headerTop + 5);

      return headerTop + 10; 
    };

    let headerHeight = drawHeader();

    y = headerHeight + 5;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    let x = 10;
    columns.forEach((col) => {
      pdf.text(col.label, x, y);
      x += 35;
    });

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    for (let i = 0; i < data.length; i++) {
      if (y + rowHeight > pageHeight - 10) {
        pdf.addPage();
        headerHeight = drawHeader();
        y = headerHeight + 5;

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        let xTitle = 10;
        columns.forEach((col) => {
          pdf.text(col.label, xTitle, y);
          xTitle += 35;
        });
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
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