// Onglet 9 — Paramètres

function renderTab9() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab9HTML();
  bindTab9Events();
}

function buildTab9HTML() {
  const s = STATE.settings;
  return `
    <div class="card">
      <div class="card-header"><h3>${t('tab9')}</h3></div>
      <div class="card-body">
        <div class="form-group">
          <label>Langue</label>
          <select id="settingsLang" class="form-control">
            <option value="fr" ${STATE.lang === 'fr' ? 'selected' : ''}>Français</option>
            <option value="ar" ${STATE.lang === 'ar' ? 'selected' : ''}>العربية</option>
          </select>
        </div>
        <div class="form-group">
          <label>Thème</label>
          <select id="settingsTheme" class="form-control">
            <option value="light" ${STATE.theme === 'light' ? 'selected' : ''}>Clair</option>
            <option value="dark" ${STATE.theme === 'dark' ? 'selected' : ''}>Sombre</option>
          </select>
        </div>
        <div class="form-group">
          <label>Seuil d'alerte (jours)</label>
          <input type="number" id="settingsAlert" class="form-control" value="${s.alertThreshold}" min="1" max="365">
        </div>
        <div class="form-group">
          <label><input type="checkbox" id="settingsWeekends" ${s.showWeekends ? 'checked' : ''}> Afficher les week-ends</label>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" id="btnSaveSettings">${t('save')}</button>
        </div>
        <hr>
        <h4>Données</h4>
        <div class="form-actions">
          <button class="btn btn-secondary" id="btnExportJSON">${t('export_json')}</button>
          <label class="btn btn-secondary">
            ${t('import_json')} <input type="file" id="importJSONInput" accept=".json" style="display:none">
          </label>
          ${isAdmin() ? `<button class="btn btn-danger" id="btnResetData">Réinitialiser les données</button>` : ''}
        </div>
        ${isAdmin() ? buildUserManagementHTML() : ''}
      </div>
    </div>`;
}

function buildUserManagementHTML() {
  const users = STATE.users || [];
  return `
    <hr>
    <h4>Gestion des utilisateurs</h4>
    <table class="table">
      <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Actions</th></tr></thead>
      <tbody>
        ${users.map(u => `<tr>
          <td>${escHtml(u.username)}</td>
          <td>${escHtml(u.role)}</td>
          <td><button class="btn btn-sm btn-danger" data-uid="${u.id}" data-action="del-user">✕</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <button class="btn btn-primary btn-sm" id="btnAddUser">Ajouter utilisateur</button>`;
}

function bindTab9Events() {
  document.getElementById('btnSaveSettings')?.addEventListener('click', saveSettings);
  document.getElementById('btnExportJSON')?.addEventListener('click', exportJSON);
  document.getElementById('importJSONInput')?.addEventListener('change', e => importJSONFile(e.target.files[0]));
  document.getElementById('btnResetData')?.addEventListener('click', resetData);
  document.getElementById('btnAddUser')?.addEventListener('click', openAddUserModal);
  document.querySelectorAll('[data-action="del-user"]').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(+btn.dataset.uid));
  });
}

function saveSettings() {
  STATE.settings.alertThreshold = +document.getElementById('settingsAlert').value;
  STATE.settings.showWeekends   = document.getElementById('settingsWeekends').checked;
  const lang  = document.getElementById('settingsLang').value;
  const theme = document.getElementById('settingsTheme').value;
  applyTheme(theme);
  if (lang !== STATE.lang) setLang(lang);
  saveState();
  showToast(t('settings_saved'), 'success');
}

function resetData() {
  if (!confirm('Réinitialiser TOUTES les données ? Cette action est irréversible.')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function openAddUserModal() {
  const content = `
    <div class="form-group"><label>Utilisateur</label><input type="text" id="newUsername" class="form-control"></div>
    <div class="form-group"><label>Mot de passe</label><input type="password" id="newPwd" class="form-control"></div>
    <div class="form-group">
      <label>Rôle</label>
      <select id="newRole" class="form-control">
        <option value="user">Utilisateur</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveNewUser()">${t('save')}</button>
      <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
    </div>`;
  openModal(content, 'Ajouter utilisateur');
}

function saveNewUser() {
  const username = document.getElementById('newUsername').value.trim();
  const pwd      = document.getElementById('newPwd').value;
  const role     = document.getElementById('newRole').value;
  if (!username || !pwd) { showToast(t('error_required'), 'error'); return; }
  if (!STATE.users) STATE.users = [];
  STATE.users.push({ id: nextId(STATE.users), username, pwd: hashPwd(pwd), role });
  saveState();
  closeModal();
  renderTab9();
}

function deleteUser(id) {
  if (!confirm(t('confirm_delete'))) return;
  STATE.users = STATE.users.filter(u => u.id !== id);
  saveState();
  renderTab9();
}
