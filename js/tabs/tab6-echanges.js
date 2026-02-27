// Onglet 6 — Échanges

function renderTab6() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab6HTML();
  bindTab6Events();
}

function buildTab6HTML() {
  const echanges = [...STATE.echanges].sort((a, b) => b.date1.localeCompare(a.date1));
  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab6')}</h3>
        ${isAdmin() ? `<button class="btn btn-primary btn-sm" id="btnAddEchange">${t('add')}</button>` : ''}
      </div>
      <div class="card-body">
        ${echanges.length === 0 ? `<p>${t('no_data')}</p>` : `
          <table class="table table-striped">
            <thead><tr><th>Agent 1</th><th>Date 1</th><th>Agent 2</th><th>Date 2</th>${isAdmin() ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
              ${echanges.map(e => `<tr>
                <td>${escHtml(e.agent1)}</td>
                <td>${formatDateFR(e.date1)}</td>
                <td>${escHtml(e.agent2)}</td>
                <td>${formatDateFR(e.date2)}</td>
                ${isAdmin() ? `<td><button class="btn btn-sm btn-danger" data-id="${e.id}" data-action="del-echange">✕</button></td>` : ''}
              </tr>`).join('')}
            </tbody>
          </table>`}
      </div>
    </div>`;
}

function bindTab6Events() {
  document.getElementById('btnAddEchange')?.addEventListener('click', openEchangeModal);
  document.querySelectorAll('[data-action="del-echange"]').forEach(btn => {
    btn.addEventListener('click', () => deleteEchange(+btn.dataset.id));
  });
}

function openEchangeModal() {
  const agents = getActiveSorted();
  const opts = agents.map(a => `<option value="${escHtml(a.nom)}">${escHtml(a.nom)}</option>`).join('');
  const content = `
    <div class="form-group"><label>Agent 1</label><select id="ech1Agent" class="form-control">${opts}</select></div>
    <div class="form-group"><label>Date 1</label><input type="date" id="ech1Date" class="form-control" value="${todayISO()}"></div>
    <div class="form-group"><label>Agent 2</label><select id="ech2Agent" class="form-control">${opts}</select></div>
    <div class="form-group"><label>Date 2</label><input type="date" id="ech2Date" class="form-control" value="${todayISO()}"></div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveEchange()">${t('save')}</button>
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, t('add') + ' — ' + t('exchange'));
}

function saveEchange() {
  const agent1 = document.getElementById('ech1Agent').value;
  const date1  = document.getElementById('ech1Date').value;
  const agent2 = document.getElementById('ech2Agent').value;
  const date2  = document.getElementById('ech2Date').value;
  const errors = validateEchange({ agent1, agent2, date1, date2 });
  if (errors.length) { showToast(errors[0], 'error'); return; }
  STATE.echanges.push({ id: nextId(STATE.echanges), agent1, date1, agent2, date2 });
  saveState();
  closeModal();
  renderTab6();
  showToast(t('save'), 'success');
}

function deleteEchange(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.echanges = STATE.echanges.filter(e => e.id !== id);
  saveState();
  renderTab6();
}
