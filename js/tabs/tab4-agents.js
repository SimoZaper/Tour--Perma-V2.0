// Onglet 4 — Gestion des agents

function renderTab4() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab4HTML();
  bindTab4Events();
}

function buildTab4HTML() {
  const agents = [...STATE.agents].sort((a, b) => (a.matricule || 0) - (b.matricule || 0));
  return `
    <div class="card">
      <div class="card-header">
        <h3>${t('tab4')}</h3>
        ${isAdmin() ? `<button class="btn btn-primary btn-sm" id="btnAddAgent">${t('add')} ${t('agent')}</button>` : ''}
      </div>
      <div class="card-body">
        ${agents.length === 0 ? `<p>${t('no_data')}</p>` : `
          <table class="table table-striped">
            <thead><tr><th>Matricule</th><th>Nom</th><th>${t('status')}</th>${isAdmin() ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
              ${agents.map(a => `<tr>
                <td>${escHtml(String(a.matricule))}</td>
                <td>${renderAvatar(a.nom)} ${escHtml(a.nom)}</td>
                <td><span class="badge ${a.actif ? 'badge-success' : 'badge-danger'}">${a.actif ? t('active') : t('inactive')}</span></td>
                ${isAdmin() ? `<td>
                  <button class="btn btn-sm btn-secondary" data-id="${a.id}" data-action="edit-agent">✏️</button>
                  <button class="btn btn-sm btn-danger" data-id="${a.id}" data-action="del-agent">✕</button>
                </td>` : ''}
              </tr>`).join('')}
            </tbody>
          </table>`}
      </div>
    </div>`;
}

function bindTab4Events() {
  document.getElementById('btnAddAgent')?.addEventListener('click', () => openAgentModal(null));
  document.querySelectorAll('[data-action="edit-agent"]').forEach(btn => {
    btn.addEventListener('click', () => openAgentModal(+btn.dataset.id));
  });
  document.querySelectorAll('[data-action="del-agent"]').forEach(btn => {
    btn.addEventListener('click', () => deleteAgent(+btn.dataset.id));
  });
}

function openAgentModal(id) {
  const agent = id ? STATE.agents.find(a => a.id === id) : null;
  const content = `
    <div class="form-group">
      <label>Matricule</label>
      <input type="number" id="agentMatricule" class="form-control" value="${agent ? agent.matricule : ''}">
    </div>
    <div class="form-group">
      <label>Nom</label>
      <input type="text" id="agentNom" class="form-control" value="${agent ? escHtml(agent.nom) : ''}">
    </div>
    <div class="form-group">
      <label>${t('status')}</label>
      <select id="agentActif" class="form-control">
        <option value="true" ${!agent || agent.actif ? 'selected' : ''}>${t('active')}</option>
        <option value="false" ${agent && !agent.actif ? 'selected' : ''}>${t('inactive')}</option>
      </select>
    </div>
    <div class="form-group">
      <label>Photo</label>
      ${agent && agent.photo ? `<div style="margin-bottom:0.5rem">${renderAvatar(agent.nom, 48)}</div>` : ''}
      <input type="file" id="agentPhoto" class="form-control" accept="image/*">
      ${agent && agent.photo ? `<button type="button" class="btn btn-sm btn-danger" style="margin-top:0.375rem" onclick="clearAgentPhoto(${id})">Supprimer la photo</button>` : ''}
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveAgent(${id || 'null'})">${t('save')}</button>
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, (id ? t('edit') : t('add')) + ' — ' + t('agent'));
}

function clearAgentPhoto(id) {
  const a = STATE.agents.find(a => a.id === id);
  if (a) { a.photo = null; saveState(); }
  closeModal();
  openAgentModal(id);
}

function resizeImageToDataURL(file, maxSize, quality, cb) {
  const reader = new FileReader();
  reader.onerror = () => { showToast('Erreur lecture fichier image', 'error'); cb(undefined); };
  reader.onload = e => {
    const img = new Image();
    img.onerror = () => { showToast('Fichier image invalide', 'error'); cb(undefined); };
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveAgent(id) {
  const matricule = +document.getElementById('agentMatricule').value;
  const nom       = document.getElementById('agentNom').value.trim();
  const actif     = document.getElementById('agentActif').value === 'true';
  const errors = validateAgent({ nom, matricule });
  if (errors.length) { showToast(errors[0], 'error'); return; }

  const photoInput = document.getElementById('agentPhoto');
  const file = photoInput && photoInput.files[0];

  function doSave(newPhoto) {
    if (id) {
      const a = STATE.agents.find(a => a.id === id);
      if (a) {
        a.nom = nom; a.matricule = matricule; a.actif = actif;
        if (newPhoto !== undefined) a.photo = newPhoto;
      }
    } else {
      STATE.agents.push({ id: nextId(STATE.agents), nom, matricule, actif, photo: newPhoto || null });
    }
    saveState();
    closeModal();
    renderTab4();
    showToast(t('save'), 'success');
  }

  if (file) {
    resizeImageToDataURL(file, 200, 0.75, photo => {
      if (photo !== undefined) doSave(photo);
    });
  } else {
    doSave(undefined);
  }
}

function deleteAgent(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.agents = STATE.agents.filter(a => a.id !== id);
  saveState();
  renderTab4();
}
