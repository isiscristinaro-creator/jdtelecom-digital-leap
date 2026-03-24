export function exportToCSV(data: Record<string, string | number>[], filename: string) {
  if (!data.length) return;
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
}
