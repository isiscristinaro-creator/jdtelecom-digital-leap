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

export function exportToExcel(data: Record<string, string | number>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  
  // Build XML Spreadsheet (opens natively in Excel)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
  xml += '<Styles>\n';
  xml += '<Style ss:ID="header"><Font ss:Bold="1" ss:Size="11"/><Interior ss:Color="#F97316" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1"/></Style>\n';
  xml += '<Style ss:ID="currency"><NumberFormat ss:Format="#,##0.00"/></Style>\n';
  xml += '<Style ss:ID="default"><Font ss:Size="10"/></Style>\n';
  xml += '</Styles>\n';
  xml += '<Worksheet ss:Name="Dados">\n<Table>\n';

  // Column widths
  headers.forEach(() => { xml += '<Column ss:AutoFitWidth="1" ss:Width="150"/>\n'; });

  // Header row
  xml += '<Row>\n';
  headers.forEach(h => { xml += `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>\n`; });
  xml += '</Row>\n';

  // Data rows
  data.forEach(row => {
    xml += '<Row>\n';
    headers.forEach(h => {
      const val = row[h];
      const isNum = typeof val === 'number';
      const style = isNum ? ' ss:StyleID="currency"' : ' ss:StyleID="default"';
      xml += `<Cell${style}><Data ss:Type="${isNum ? 'Number' : 'String'}">${isNum ? val : escapeXml(String(val ?? ""))}</Data></Cell>\n`;
    });
    xml += '</Row>\n';
  });

  xml += '</Table>\n</Worksheet>\n</Workbook>';

  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
