// Export PDF via jsPDF + html2canvas

function exportPDF(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) { showToast(t('error_element_not_found'), 'error'); return; }
  if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
    showToast(t('error_lib_pdf'), 'error'); return;
  }
  html2canvas(el).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({ orientation: 'landscape' });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    pdf.save(filename || 'planning.pdf');
    addLog('export', 'Export PDF: ' + (filename || 'planning.pdf'));
  });
}
