// Gestion des thèmes clair/sombre

function applyTheme(theme) {
  STATE.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const next = STATE.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveState();
}
