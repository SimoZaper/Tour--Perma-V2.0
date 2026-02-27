// Authentification : login, logout, rôles, hachage

function hashPwd(pwd) {
  // FNV-1a 32-bit hash
  let h = 2166136261;
  const str = HASH_SALT + pwd;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function isAdmin() {
  return STATE.currentUser && STATE.currentUser.role === 'admin';
}

function doLogin(username, password) {
  // Default admin if no users defined
  if (!STATE.users || STATE.users.length === 0) {
    STATE.users = [{ id: 1, username: 'admin', pwd: hashPwd('admin'), role: 'admin' }];
    saveState();
  }
  const hashed = hashPwd(password);
  const user = STATE.users.find(u => u.username === username && u.pwd === hashed);
  if (!user) return false;
  STATE.currentUser = { id: user.id, username: user.username, role: user.role };
  addLog('connexion', `Connexion: ${username}`);
  saveState();
  return true;
}

function doLogout() {
  addLog('déconnexion', `Déconnexion: ${STATE.currentUser ? STATE.currentUser.username : '?'}`);
  STATE.currentUser = null;
  saveState();
  document.getElementById('appPage').style.display = 'none';
  document.getElementById('loginPage').style.display = '';
}

function addLog(type, message) {
  STATE.logs.unshift({
    id: nextId(STATE.logs),
    date: new Date().toISOString(),
    type,
    message,
    user: STATE.currentUser ? STATE.currentUser.username : 'système'
  });
  if (STATE.logs.length > MAX_LOGS_RETAINED) {
    STATE.logs = STATE.logs.slice(0, MAX_LOGS_RETAINED);
  }
}
