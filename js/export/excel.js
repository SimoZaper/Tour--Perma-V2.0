// Export Excel via SheetJS

function exportExcel(data, filename, sheetName) {
  if (typeof XLSX === 'undefined') {
    showToast('Bibliothèque Excel non chargée', 'error'); return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Données');
  XLSX.writeFile(wb, filename || 'export.xlsx');
  addLog('export', 'Export Excel: ' + (filename || 'export.xlsx'));
}
