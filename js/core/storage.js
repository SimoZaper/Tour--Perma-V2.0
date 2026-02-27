// Persistance + migrations
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch (e) {
    console.error('saveState error:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const stored = JSON.parse(raw);
    // Migrations
    stored.users     = migratePasswords(stored.users || []);
    stored.prevTours = migratePrevTours(stored.prevTours || []);
    // Merge into STATE (keep defaults for missing keys)
    Object.assign(STATE, stored);
    // Always ensure settings has all keys
    STATE.settings = Object.assign({
      alertThreshold: DEFAULT_ALERT_THRESHOLD,
      showWeekends: true,
      autoSave: true
    }, STATE.settings || {});
  } catch (e) {
    console.error('loadState error:', e);
  }
}

// FNV-1a hashes are exactly 8 hex characters; base64-encoded passwords are longer.
// Any stored password shorter than MIN_HASHED_PWD_LEN is assumed to be a legacy btoa value.
const MIN_HASHED_PWD_LEN = 20;

// Migration: btoa passwords → FNV-1a hash
function migratePasswords(users) {
  return users.map(u => {
    if (u.pwd && u.pwd.length < MIN_HASHED_PWD_LEN) {
      try {
        u.pwd = hashPwd(atob(u.pwd));
      } catch (e) {
        // Already migrated or not valid base64 — leave as-is
      }
    }
    return u;
  });
}

// Migration: flat prevTours → grouped format
function migratePrevTours(arr) {
  if (!arr.length) return arr;
  if (typeof arr[0] === 'object' && arr[0].dateISO) {
    // Already new format
    return arr;
  }
  // Old flat format: string array → wrap
  return arr.map((entry, i) => ({
    id: i + 1,
    dateISO: entry.dateISO || entry,
    agentNom: entry.agentNom || entry,
    note: ''
  }));
}
