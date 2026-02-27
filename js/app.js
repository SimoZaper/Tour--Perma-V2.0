// Point d'entrée — Bootstrap DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
  // 1. Charger l'état depuis localStorage
  loadState();

  // 2. Appliquer le thème et la langue sauvegardés
  applyTheme(STATE.theme || 'light');
  applyLang();

  // 3. Initialiser les agents par défaut si vide
  if (STATE.agents.length === 0) {
    STATE.agents = AGENTS_INIT.map(a => ({ ...a }));
    saveState();
  }

  // 4. Événements login
  document.getElementById('btnLogin').addEventListener('click', handleLogin);
  document.getElementById('loginPassword').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });

  // 5. Événements header
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('btnLogout').addEventListener('click', doLogout);
  document.getElementById('langToggle').addEventListener('click', () => {
    setLang(STATE.lang === 'fr' ? 'ar' : 'fr');
  });

  // 6. Événements navbar
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(+btn.dataset.tab));
  });

  // 7. Si déjà connecté, afficher l'app
  if (STATE.currentUser) {
    showApp();
  }
});

function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (doLogin(username, password)) {
    showApp();
  } else {
    showToast(t('error_login'), 'error');
  }
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appPage').style.display = '';
  const userDisplay = document.getElementById('currentUser');
  if (userDisplay) userDisplay.textContent = STATE.currentUser.username;
  switchTab(STATE.currentTab || 1);
}
