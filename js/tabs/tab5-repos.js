// Onglet 5 — Repos & Absences

function renderTab5() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab5HTML();
  bindTab5Events();
}

function buildTab5HTML() {
  const repos = [...STATE.repos].sort((a, b) => b.debut.localeCompare(a.debut));
  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab5')}</h3>
        ${isAdmin() ? `<button class="btn btn-primary btn-sm" id="btnAddRepos">${t('add')}</button>` : ''}
      </div>
      <div class="card-body">
        ${repos.length === 0 ? `<p>${t('no_data')}</p>` : `
          <table class="table table-striped">
            <thead><tr><th>${t('agent')}</th><th>Début</th><th>Fin</th><th>Type</th>${isAdmin() ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
              ${repos.map(r => `<tr>
                <td>${escHtml(r.agent)}</td>
                <td>${formatDateFR(r.debut)}</td>
                <td>${formatDateFR(r.fin)}</td>
                <td><span class="badge badge-warning">${escHtml(r.type || t('absence'))}</span></td>
                ${isAdmin() ? `<td><button class="btn btn-sm btn-danger" data-id="${r.id}" data-action="del-repos">✕</button></td>` : ''}
              </tr>`).join('')}
            </tbody>
          </table>`}
      </div>
    </div>`;
}

function bindTab5Events() {
  document.getElementById('btnAddRepos')?.addEventListener('click', openReposModal);
  document.querySelectorAll('[data-action="del-repos"]').forEach(btn => {
    btn.addEventListener('click', () => deleteRepos(+btn.dataset.id));
  });
}

function openReposModal() {
  const agents = getActiveSorted();
  const content = `
    <div class="form-group">
      <label>${t('agent')}</label>
      <select id="reposAgent" class="form-control">
        ${agents.map(a => `<option value="${escHtml(a.nom)}">${escHtml(a.nom)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Début</label>
      <input type="date" id="reposDebut" class="form-control" value="${todayISO()}">
    </div>
    <div class="form-group">
      <label>Fin</label>
      <input type="date" id="reposFin" class="form-control" value="${todayISO()}">
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="reposType" class="form-control">
        <option value="repos">${t('rest')}</option>
        <option value="absence">${t('absence')}</option>
        <option value="conge">Congé</option>
        <option value="maladie">Maladie</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveRepos()">${t('save')}</button>
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, t('add') + ' — ' + t('tab5'));
}

function saveRepos() {
  const agent = document.getElementById('reposAgent').value;
  const debut = document.getElementById('reposDebut').value;
  const fin   = document.getElementById('reposFin').value;
  const type  = document.getElementById('reposType').value;
  const errors = validateAbsence({ agent, debut, fin });
  if (errors.length) { showToast(errors[0], 'error'); return; }
  STATE.repos.push({ id: nextId(STATE.repos), agent, debut, fin, type });
  saveState();
  closeModal();
  renderTab5();
  showToast(t('save'), 'success');
}

function deleteRepos(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.repos = STATE.repos.filter(r => r.id !== id);
  saveState();
  renderTab5();
}
