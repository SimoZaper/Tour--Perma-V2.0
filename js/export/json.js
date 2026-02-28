// Export / Import JSON

function exportJSON() {
  const data = JSON.stringify(STATE, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `permanence-backup-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  addLog('export', 'Export JSON');
  saveState();
}

function importJSONFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      Object.assign(STATE, imported);
      saveState();
      renderCurrentTab();
      showToast(t('settings_saved'), 'success');
      addLog('import', 'Import JSON: ' + file.name);
    } catch (err) {
      showToast(t('error_import_json'), 'error');
    }
  };
  reader.readAsText(file);
}
