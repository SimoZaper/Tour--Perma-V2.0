// Onglet 1 — Accueil

function renderTab1() {
  const html = buildTab1HTML();
  document.getElementById('contentArea').innerHTML = html;
  document.getElementById('appSidebar').innerHTML = buildSidebarHTML();
  document.getElementById('appSidebar').style.display = '';
  bindTab1Events();
}

function buildTab1HTML() {
  const today = todayISO();
  const todayPlan = getPlanByDate(today);
  const agentToday = todayPlan ? todayPlan.agentNom : t('no_data');

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const p = getPlanByDate(d);
    days.push({ dateISO: d, agentNom: p ? p.agentNom : '—' });
  }

  return `
    <div class="banner-card">
      <h2>${t('app_title')}</h2>
      <p>${t('today')}: <strong>${formatDateFR(today)}</strong></p>
      <p>${t('duty')}: <strong>${escHtml(agentToday)}</strong></p>
    </div>
    <div class="day-cards-grid">
      ${days.map(d => `
        <div class="day-card" data-date="${d.dateISO}">
          <div class="day-card-date">${formatDateFR(d.dateISO)}</div>
          <div class="day-card-agent">${escHtml(d.agentNom)}</div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><h3>${t('planning_generated')}</h3></div>
      <div class="card-body">${buildHomePlanningTable()}</div>
    </div>`;
}

function buildHomePlanningTable() {
  const today = todayISO();
  const entries = STATE.planning.filter(p => p.dateISO >= today).slice(0, 10);
  if (entries.length === 0) return `<p class="text-muted">${t('no_data')}</p>`;
  return `<table class="table">
    <thead><tr><th>${t('date')}</th><th>${t('agent')}</th></tr></thead>
    <tbody>
      ${entries.map(p => `<tr>
        <td>${formatDateFR(p.dateISO)}</td>
        <td>${renderAvatar(p.agentNom)} ${escHtml(p.agentNom)}</td>
      </tr>`).join('')}
    </tbody></table>`;
}

function buildSidebarHTML() {
  const today = todayISO();
  const upcoming = STATE.planning.filter(p => p.dateISO >= today).slice(0, 5);
  return `
    <div class="sidebar-section">
      <h4>${t('duty')} — prochains</h4>
      <ul class="sidebar-list">
        ${upcoming.map(p => `<li>${formatDateFR(p.dateISO)}: <strong>${escHtml(p.agentNom)}</strong></li>`).join('') || `<li>${t('no_data')}</li>`}
      </ul>
    </div>
    <div class="sidebar-section">
      <h4>${t('agents')}</h4>
      <p>${getActiveSorted().length} actifs</p>
    </div>`;
}

function bindTab1Events() {
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => openDayModal(card.dataset.date));
  });
}

function openDayModal(dateISO) {
  const p = getPlanByDate(dateISO);
  const content = `
    <p><strong>${t('date')}:</strong> ${formatDateFR(dateISO)}</p>
    <p><strong>${t('agent')}:</strong> ${p ? escHtml(p.agentNom) : t('no_data')}</p>`;
  openModal(content, formatDateFR(dateISO));
}
