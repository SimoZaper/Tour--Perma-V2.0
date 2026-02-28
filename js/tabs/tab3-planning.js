// Onglet 3 — Planning complet

function renderTab3() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab3HTML();
  bindTab3Events();
}

function buildTab3HTML() {
  const today = todayISO();
  const entries = STATE.planning
    .filter(p => p.dateISO >= addDays(today, -DAYS_BEFORE_TODAY))
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab3')}</h3>
        <div class="header-actions">
          ${isAdmin() ? `<button class="btn btn-primary btn-sm" id="btnGenerate">${t('generate')}</button>` : ''}
          <button class="btn btn-secondary btn-sm" id="btnExportPDF">${t('export_pdf')}</button>
          <button class="btn btn-secondary btn-sm" id="btnExportExcel">${t('export_excel')}</button>
        </div>
      </div>
      <div class="card-body" id="planningContent">
        ${buildPlanningTable(entries)}
      </div>
    </div>`;
}

function buildPlanningTable(entries) {
  if (entries.length === 0) return `<p>${t('no_data')}</p>`;
  const today = todayISO();
  return `<table class="table table-striped planning-table">
    <thead><tr><th>${t('date')}</th><th>${t('agent')}</th><th>J+1 Récup</th></tr></thead>
    <tbody>
      ${entries.map(p => `<tr class="${p.dateISO === today ? 'row-today' : ''}">
        <td>${formatDateFR(p.dateISO)}</td>
        <td>${renderAvatar(p.agentNom)} ${escHtml(p.agentNom)}</td>
        <td>${formatDateFR(getRecupISO(p.dateISO))}</td>
      </tr>`).join('')}
    </tbody></table>`;
}

function bindTab3Events() {
  document.getElementById('btnGenerate')?.addEventListener('click', () => {
    buildFullPlanning();
    renderTab3();
    showToast(t('planning_generated'), 'success');
    addLog('planning', 'Planning généré');
  });
  document.getElementById('btnExportPDF')?.addEventListener('click', () => {
    exportPDF('planningContent', 'planning.pdf');
  });
  document.getElementById('btnExportExcel')?.addEventListener('click', () => {
    const data = STATE.planning.map(p => ({ Date: p.dateISO, Agent: p.agentNom }));
    exportExcel(data, 'planning.xlsx', 'Planning');
  });
}
