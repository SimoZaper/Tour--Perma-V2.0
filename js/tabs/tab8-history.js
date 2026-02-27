// Onglet 8 — Historique & Logs

function renderTab8() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab8HTML();
  bindTab8Events();
}

function buildTab8HTML() {
  const logs = STATE.logs.slice(0, 50);
  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab8')}</h3>
        ${isAdmin() ? `<button class="btn btn-sm btn-danger" id="btnClearLogs">Vider les logs</button>` : ''}
      </div>
      <div class="card-body">
        ${logs.length === 0 ? `<p>${t('no_data')}</p>` : `
          <table class="table table-striped">
            <thead><tr><th>Date</th><th>Type</th><th>Message</th><th>Utilisateur</th></tr></thead>
            <tbody>
              ${logs.map(log => `<tr>
                <td>${new Date(log.date).toLocaleString()}</td>
                <td><span class="badge badge-info">${escHtml(log.type)}</span></td>
                <td>${escHtml(log.message)}</td>
                <td>${escHtml(log.user || '')}</td>
              </tr>`).join('')}
            </tbody>
          </table>`}
      </div>
    </div>`;
}

function bindTab8Events() {
  document.getElementById('btnClearLogs')?.addEventListener('click', () => {
    if (!confirm(t('confirm_delete'))) return;
    STATE.logs = [];
    saveState();
    renderTab8();
  });
}
