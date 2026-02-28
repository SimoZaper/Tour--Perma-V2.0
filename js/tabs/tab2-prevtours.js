// Onglet 2 — Tours précédents

function renderTab2() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab2HTML();
  bindTab2Events();
}

function buildTab2HTML() {
  const tours = [...STATE.prevTours].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab2')}</h3>
        ${isAdmin() ? `<button class="btn btn-primary btn-sm" id="btnAddPrevTour">${t('add')}</button>` : ''}
      </div>
      <div class="card-body">
        ${tours.length === 0 ? `<p>${t('no_data')}</p>` : `
          <table class="table table-striped">
            <thead><tr><th>${t('date')}</th><th>${t('agent')}</th><th>Note</th>${isAdmin() ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
              ${tours.map(tour => `<tr>
                <td>${formatDateFR(tour.dateISO)}</td>
                <td>${escHtml(tour.agentNom)}</td>
                <td>${escHtml(tour.note || '')}</td>
                ${isAdmin() ? `<td>
                  <button class="btn btn-sm btn-danger" data-id="${tour.id}" data-action="del-prev">✕</button>
                </td>` : ''}
              </tr>`).join('')}
            </tbody>
          </table>`}
      </div>
    </div>`;
}

function bindTab2Events() {
  document.getElementById('btnAddPrevTour')?.addEventListener('click', openAddPrevTourModal);
  document.querySelectorAll('[data-action="del-prev"]').forEach(btn => {
    btn.addEventListener('click', () => deletePrevTour(+btn.dataset.id));
  });
}

function openAddPrevTourModal() {
  const agents = getActiveSorted();
  const content = `
    <div class="form-group">
      <label>${t('date')}</label>
      <input type="date" id="prevTourDate" class="form-control" value="${todayISO()}">
    </div>
    <div class="form-group">
      <label>${t('agent')}</label>
      <select id="prevTourAgent" class="form-control">
        ${agents.map(a => `<option value="${escHtml(a.nom)}">${escHtml(a.nom)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Note</label>
      <input type="text" id="prevTourNote" class="form-control" placeholder="Optionnel">
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="savePrevTour()">${t('save')}</button>
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, t('add') + ' — ' + t('tab2'));
}

function savePrevTour() {
  const dateISO  = document.getElementById('prevTourDate').value;
  const agentNom = document.getElementById('prevTourAgent').value;
  const note     = document.getElementById('prevTourNote').value.trim();
  if (!dateISO || !agentNom) { showToast(t('error_required'), 'error'); return; }
  STATE.prevTours.push({ id: nextId(STATE.prevTours), dateISO, agentNom, note });
  saveState();
  closeModal();
  renderTab2();
  showToast(t('save'), 'success');
}

function deletePrevTour(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.prevTours = STATE.prevTours.filter(item => item.id !== id);
  saveState();
  renderTab2();
}
