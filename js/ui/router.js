// Navigation entre onglets

function switchTab(n) {
  STATE.currentTab = n;
  // Mettre à jour la navbar
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', +btn.dataset.tab === n);
  });
  // Masquer sidebar par défaut
  document.getElementById('appSidebar').style.display = 'none';
  renderCurrentTab();
}

function renderCurrentTab() {
  const renders = {
    1: renderTab1, 2: renderTab2, 3: renderTab3,
    4: renderTab4, 5: renderTab5, 6: renderTab6,
    7: renderTab7, 8: renderTab8, 9: renderTab9
  };
  const fn = renders[STATE.currentTab];
  if (fn) fn();
}
