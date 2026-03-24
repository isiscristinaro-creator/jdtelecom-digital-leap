import XLSX from "xlsx-js-style";

type ExportValue = string | number | boolean | null | undefined;

export function exportToCSV(data: Record<string, ExportValue>[], filename: string) {
  if (!data.length) return false;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(";"),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      const str = String(val ?? "");
      return str.includes(";") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(";"))
  ];
  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

interface ExportExcelOptions {
  reportTitle?: string;
  reportSubtitle?: string;
}

const HEADER_FILL = { fgColor: { rgb: "1B3A5C" } };
const HEADER_FONT = { bold: true, color: { rgb: "FFFFFF" }, sz: 11, name: "Arial" };
const TITLE_FONT = { bold: true, color: { rgb: "1B3A5C" }, sz: 16, name: "Arial" };
const SUBTITLE_FONT = { bold: true, color: { rgb: "444444" }, sz: 12, name: "Arial" };
const DATE_FONT = { color: { rgb: "888888" }, sz: 10, name: "Arial", italic: true };
const BODY_FONT = { sz: 10, name: "Arial", color: { rgb: "333333" } };
const ZEBRA_FILL = { fgColor: { rgb: "F2F6FA" } };
const WHITE_FILL = { fgColor: { rgb: "FFFFFF" } };
const THIN_BORDER = {
  top: { style: "thin", color: { rgb: "D0D5DD" } },
  bottom: { style: "thin", color: { rgb: "D0D5DD" } },
  left: { style: "thin", color: { rgb: "D0D5DD" } },
  right: { style: "thin", color: { rgb: "D0D5DD" } },
};

function detectAlignment(header: string, value: ExportValue): string {
  const h = header.toLowerCase();
  if (h.includes("status")) return "center";
  if (h.includes("valor") || h.includes("r$") || h.includes("price") || h.includes("preço") || typeof value === "number") return "right";
  return "left";
}

export function exportToExcel(
  data: Record<string, ExportValue>[],
  filename: string,
  options?: ExportExcelOptions
) {
  if (!data.length) return false;

  const headers = Object.keys(data[0]);
  const colCount = headers.length;
  const titleRow = 0;
  const subtitleRow = 1;
  const dateRow = 2;
  const headerRow = 4;
  const dataStartRow = 5;

  const reportTitle = options?.reportTitle || "JD Telecom";
  const reportSubtitle = options?.reportSubtitle || "Relatório";
  const now = new Date();
  const dateStr = `Gerado em: ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  // Build worksheet data
  const wsData: (string | number | boolean | null)[][] = [];

  // Title rows
  wsData.push([reportTitle, ...Array(colCount - 1).fill(null)]);
  wsData.push([reportSubtitle, ...Array(colCount - 1).fill(null)]);
  wsData.push([dateStr, ...Array(colCount - 1).fill(null)]);
  wsData.push(Array(colCount).fill(null)); // spacer
  wsData.push(headers); // header row

  // Data rows
  data.forEach(row => {
    wsData.push(headers.map(h => {
      const v = row[h];
      return v === null || v === undefined ? "" : v;
    }));
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Merge title cells
  ws["!merges"] = [
    { s: { r: titleRow, c: 0 }, e: { r: titleRow, c: colCount - 1 } },
    { s: { r: subtitleRow, c: 0 }, e: { r: subtitleRow, c: colCount - 1 } },
    { s: { r: dateRow, c: 0 }, e: { r: dateRow, c: colCount - 1 } },
  ];

  // Style title rows
  for (let c = 0; c < colCount; c++) {
    const titleCell = XLSX.utils.encode_cell({ r: titleRow, c });
    const subCell = XLSX.utils.encode_cell({ r: subtitleRow, c });
    const dateCell = XLSX.utils.encode_cell({ r: dateRow, c });

    if (ws[titleCell]) ws[titleCell].s = { font: TITLE_FONT, alignment: { horizontal: "left", vertical: "center" } };
    if (ws[subCell]) ws[subCell].s = { font: SUBTITLE_FONT, alignment: { horizontal: "left", vertical: "center" } };
    if (ws[dateCell]) ws[dateCell].s = { font: DATE_FONT, alignment: { horizontal: "left", vertical: "center" } };
  }

  // Style header row
  for (let c = 0; c < colCount; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRow, c });
    if (ws[ref]) {
      ws[ref].s = {
        font: HEADER_FONT,
        fill: HEADER_FILL,
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: THIN_BORDER,
      };
    }
  }

  // Style data rows
  for (let r = 0; r < data.length; r++) {
    const isZebra = r % 2 === 1;
    for (let c = 0; c < colCount; c++) {
      const ref = XLSX.utils.encode_cell({ r: dataStartRow + r, c });
      if (!ws[ref]) ws[ref] = { v: "", t: "s" };
      const align = detectAlignment(headers[c], data[r][headers[c]]);
      ws[ref].s = {
        font: BODY_FONT,
        fill: isZebra ? ZEBRA_FILL : WHITE_FILL,
        alignment: { horizontal: align, vertical: "center" },
        border: THIN_BORDER,
      };
    }
  }

  // Auto column widths
  ws["!cols"] = headers.map((header, c) => {
    let maxW = header.length;
    data.forEach(row => {
      const len = String(row[header] ?? "").length;
      if (len > maxW) maxW = len;
    });
    return { wch: Math.min(50, maxW + 4) };
  });

  // Row heights
  ws["!rows"] = [];
  ws["!rows"][titleRow] = { hpt: 28 };
  ws["!rows"][subtitleRow] = { hpt: 22 };
  ws["!rows"][dateRow] = { hpt: 18 };
  ws["!rows"][headerRow] = { hpt: 24 };

  // Freeze panes below header
  ws["!freeze"] = { xSplit: 0, ySplit: dataStartRow, topLeftCell: XLSX.utils.encode_cell({ r: dataStartRow, c: 0 }) };

  // Auto filter on header row
  ws["!autofilter"] = { ref: `${XLSX.utils.encode_cell({ r: headerRow, c: 0 })}:${XLSX.utils.encode_cell({ r: headerRow + data.length, c: colCount - 1 })}` };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dados");

  // Set freeze panes via sheet views
  if (!ws["!views"]) ws["!views"] = [];
  ws["!views"].push({ state: "frozen", ySplit: dataStartRow });

  XLSX.writeFile(wb, `${filename}.xlsx`, { compression: true });
  return true;
}
