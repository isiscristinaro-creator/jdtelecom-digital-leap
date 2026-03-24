import * as XLSX from "xlsx";

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

export function exportToExcel(data: Record<string, ExportValue>[], filename: string) {
  if (!data.length) return false;

  const headers = Object.keys(data[0]);

  const normalizedData = data.map((row) => {
    const normalizedRow: Record<string, string | number | boolean> = {};

    headers.forEach((header) => {
      const value = row[header];
      normalizedRow[header] = value ?? "";
    });

    return normalizedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(normalizedData, { header: headers });
  worksheet["!cols"] = headers.map((header) => {
    const maxDataWidth = Math.max(...normalizedData.map((row) => String(row[header]).length), header.length);
    return { wch: Math.min(48, maxDataWidth + 3) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
  XLSX.writeFile(workbook, `${filename}.xlsx`, { compression: true });

  return true;
}
