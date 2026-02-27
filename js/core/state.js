// Objet STATE + helpers d'accès
let STATE = {
  lang: 'fr',
  theme: 'light',
  currentUser: null,
  currentTab: 1,
  agents: [],
  planning: [],
  repos: [],
  echanges: [],
  logs: [],
  connexions: [],
  prevTours: [],
  settings: {
    alertThreshold: DEFAULT_ALERT_THRESHOLD,
    showWeekends: true,
    autoSave: true
  },
  users: []
};

// Helpers purs (lecture seule, jamais de mutation directe)
function getActiveSorted() {
  return STATE.agents.filter(a => a.actif).sort((a, b) => a.matricule - b.matricule);
}

function nextId(arr) {
  return Math.max(0, ...arr.map(x => x.id || 0)) + 1;
}

function getPlanByDate(dateISO) {
  return STATE.planning.find(p => p.dateISO === dateISO) || null;
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Date helpers
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateISO, n) {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function dowOf(dateISO) {
  return new Date(dateISO).getDay();
}

function formatDateFR(dateISO) {
  const d = new Date(dateISO);
  const dow = STATE.lang === 'ar' ? JOURS_AR[d.getDay()] : JOURS_FR[d.getDay()];
  const mois = STATE.lang === 'ar' ? MOIS_AR[d.getMonth()] : MOIS_FR[d.getMonth()];
  return `${dow} ${d.getDate()} ${mois} ${d.getFullYear()}`;
}
