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
  const todayPlans = getPlansByDate(today);
  const agentToday = todayPlans.length ? todayPlans.map(p => escHtml(p.agentNom)).join(', ') : t('no_data');

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const plans = getPlansByDate(d);
    days.push({ dateISO: d, agentNoms: plans.map(p => p.agentNom) });
  }

  return `
    <div class="banner-card">
      <h2>${t('app_title')}</h2>
      <p>${t('today')}: <strong>${formatDateFR(today)}</strong></p>
      <p>${t('duty')}: <strong>${agentToday}</strong></p>
    </div>
    <div class="day-cards-grid">
      ${days.map(d => `
        <div class="day-card${isAdmin() ? ' day-card-admin' : ''}" data-date="${d.dateISO}">
          <div class="day-card-date">${formatDateFR(d.dateISO)}</div>
          <div class="day-card-agent">${d.agentNoms.length ? d.agentNoms.map(n => escHtml(n)).join(', ') : '—'}</div>
          ${isAdmin() ? `<div class="day-card-hint">Cliquez pour assigner</div>` : ''}
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
  const dates = [...new Set(
    STATE.planning.filter(p => p.dateISO >= today).map(p => p.dateISO)
  )].sort().slice(0, 10);
  if (dates.length === 0) return `<p class="text-muted">${t('no_data')}</p>`;
  return `<table class="table">
    <thead><tr><th>${t('date')}</th><th>${t('agent')}</th></tr></thead>
    <tbody>
      ${dates.map(dateISO => {
        const plans = getPlansByDate(dateISO);
        return `<tr>
          <td>${formatDateFR(dateISO)}</td>
          <td>${plans.map(p => renderAvatar(p.agentNom) + ' ' + escHtml(p.agentNom)).join('&nbsp; ')}</td>
        </tr>`;
      }).join('')}
    </tbody></table>`;
}

function buildSidebarHTML() {
  const today = todayISO();
  const dates = [...new Set(
    STATE.planning.filter(p => p.dateISO >= today).map(p => p.dateISO)
  )].sort().slice(0, 5);
  return `
    <div class="sidebar-section">
      <h4>${t('duty')} — prochains</h4>
      <ul class="sidebar-list">
        ${dates.map(dateISO => {
          const noms = getPlansByDate(dateISO).map(p => escHtml(p.agentNom)).join(', ');
          return `<li>${formatDateFR(dateISO)}: <strong>${noms}</strong></li>`;
        }).join('') || `<li>${t('no_data')}</li>`}
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
  const plans = getPlansByDate(dateISO);
  const assignedNames = new Set(plans.map(p => p.agentNom));
  const agents = getActiveSorted();

  let content = `<p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem"><strong>${t('date')}:</strong> ${formatDateFR(dateISO)}</p>`;

  if (isAdmin()) {
    content += `
      <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem">
        Cliquez sur un agent pour l'assigner / retirer ce jour
      </p>
      <div class="agent-chips">
        ${agents.map(a => `
          <span class="agent-chip ${assignedNames.has(a.nom) ? 'agent-chip-active' : ''}"
                data-agent="${escHtml(a.nom)}" data-date="${dateISO}">
            ${renderAvatar(a.nom, 24)} ${escHtml(a.nom)}
          </span>
        `).join('')}
      </div>`;
  } else {
    content += `<p><strong>${t('agent')}:</strong> ${plans.map(p => escHtml(p.agentNom)).join(', ') || t('no_data')}</p>`;
  }

  openModal(content, formatDateFR(dateISO));

  if (isAdmin()) {
    document.querySelectorAll('.agent-chip[data-date]').forEach(chip => {
      chip.addEventListener('click', () => toggleDayAgent(chip.dataset.date, chip.dataset.agent, chip));
    });
  }
}

function toggleDayAgent(dateISO, agentNom, chipEl) {
  const idx = STATE.planning.findIndex(p => p.dateISO === dateISO && p.agentNom === agentNom);
  if (idx >= 0) {
    STATE.planning.splice(idx, 1);
    if (chipEl) chipEl.classList.remove('agent-chip-active');
  } else {
    STATE.planning.push({ id: nextId(STATE.planning), dateISO, agentNom });
    if (chipEl) chipEl.classList.add('agent-chip-active');
  }
  saveState();
  renderTab1();
}
