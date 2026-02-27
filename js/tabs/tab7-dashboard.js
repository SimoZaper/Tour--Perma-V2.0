// Onglet 7 — Tableau de bord

function renderTab7() {
  document.getElementById('appSidebar').style.display = 'none';
  document.getElementById('contentArea').innerHTML = buildTab7HTML();
  renderDashboardChart();
}

function buildTab7HTML() {
  const agents = getActiveSorted();
  const stats = computeDashboardStats(agents);
  return `
    <div class="card">
      <div class="card-header"><h3>${t('tab7')}</h3></div>
      <div class="card-body">
        <div class="stats-grid">
          ${stats.map(s => `
            <div class="stat-card">
              <div class="stat-value">${escHtml(String(s.value))}</div>
              <div class="stat-label">${escHtml(s.label)}</div>
            </div>`).join('')}
        </div>
        <div class="chart-container">
          <canvas id="dashChart"></canvas>
        </div>
        <div class="card-body">${buildAgentStatsTable(agents)}</div>
      </div>
    </div>`;
}

function computeDashboardStats(agents) {
  return [
    { label: t('agents') + ' actifs', value: agents.length },
    { label: t('duty') + ' planifiées', value: STATE.planning.length },
    { label: t('absence') + 's', value: STATE.repos.length },
    { label: t('exchange') + 's', value: STATE.echanges.length }
  ];
}

function buildAgentStatsTable(agents) {
  const counts = {};
  STATE.planning.forEach(p => { counts[p.agentNom] = (counts[p.agentNom] || 0) + 1; });
  return `<table class="table">
    <thead><tr><th>${t('agent')}</th><th>Nb permanences</th></tr></thead>
    <tbody>
      ${agents.map(a => `<tr>
        <td>${renderAvatar(a.nom)} ${escHtml(a.nom)}</td>
        <td>${counts[a.nom] || 0}</td>
      </tr>`).join('')}
    </tbody></table>`;
}

function renderDashboardChart() {
  const canvas = document.getElementById('dashChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const agents = getActiveSorted();
  const counts = {};
  STATE.planning.forEach(p => { counts[p.agentNom] = (counts[p.agentNom] || 0) + 1; });
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: agents.map(a => a.nom),
      datasets: [{ label: 'Permanences', data: agents.map(a => counts[a.nom] || 0), backgroundColor: '#2563eb' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}
