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
                <td>${renderAvatar(tour.agentNom, 24)} ${escHtml(tour.agentNom)}</td>
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
  const date = todayISO();
  const content = `
    <div class="form-group">
      <label>${t('date')}</label>
      <input type="date" id="prevTourDate" class="form-control" value="${date}">
    </div>
    <div class="form-group">
      <label>Note (optionnel)</label>
      <input type="text" id="prevTourNote" class="form-control" placeholder="Note">
    </div>
    <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.5rem">
      Cliquez sur un agent pour l'ajouter / retirer ce jour
    </p>
    <div class="agent-chips" id="prevTourChips">
      ${buildPrevTourChips(date, agents)}
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, t('add') + ' — ' + t('tab2'));
  bindPrevTourChipEvents(agents);
  document.getElementById('prevTourDate').addEventListener('change', () => {
    const d = document.getElementById('prevTourDate').value;
    document.getElementById('prevTourChips').innerHTML = buildPrevTourChips(d, getActiveSorted());
    bindPrevTourChipEvents(getActiveSorted());
  });
}

function buildPrevTourChips(dateISO, agents) {
  const assignedNames = new Set(
    STATE.prevTours.filter(p => p.dateISO === dateISO).map(p => p.agentNom)
  );
  return agents.map(a => `
    <span class="agent-chip ${assignedNames.has(a.nom) ? 'agent-chip-active' : ''}" data-agent="${escHtml(a.nom)}">
      ${renderAvatar(a.nom, 24)} ${escHtml(a.nom)}
    </span>
  `).join('');
}

function bindPrevTourChipEvents(agents) {
  document.querySelectorAll('#prevTourChips .agent-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const dateISO  = document.getElementById('prevTourDate').value;
      const note     = document.getElementById('prevTourNote').value.trim();
      const agentNom = chip.dataset.agent;
      const idx = STATE.prevTours.findIndex(p => p.dateISO === dateISO && p.agentNom === agentNom);
      if (idx >= 0) {
        STATE.prevTours.splice(idx, 1);
        chip.classList.remove('agent-chip-active');
      } else {
        STATE.prevTours.push({ id: nextId(STATE.prevTours), dateISO, agentNom, note });
        chip.classList.add('agent-chip-active');
      }
      saveState();
      renderTab2();
    });
  });
}

function deletePrevTour(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.prevTours = STATE.prevTours.filter(item => item.id !== id);
  saveState();
  renderTab2();
}
