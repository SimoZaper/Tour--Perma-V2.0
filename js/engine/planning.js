// Génération du planning (R05, R06)
// Ces fonctions ne touchent JAMAIS au DOM.

function generatePlanning() {
  const agents = getActiveSorted();
  if (agents.length === 0) return [];

  const start = addDays(todayISO(), -DAYS_BEFORE_TODAY);
  const end   = addDays(todayISO(), DAYS_AHEAD);
  let cycle   = calcCycleFromPrev(agents);
  const recupMap = buildRecupMap(STATE.planning);
  const result = [];
  let cycleIdx = 0;
  let currentDate = start;

  while (currentDate <= end) {
    // R05 : skip Fridays (day 5)
    if (dowOf(currentDate) !== 5) {
      let assigned = false;
      let tries = 0;
      while (!assigned && tries < cycle.length) {
        const agentNom = cycle[cycleIdx % cycle.length];
        if (isAvailable(agentNom, currentDate, recupMap)) {
          result.push({ dateISO: currentDate, agentNom, generated: true });
          // Update recupMap
          const recup = getRecupISO(currentDate);
          if (!recupMap[recup]) recupMap[recup] = new Set();
          recupMap[recup].add(agentNom);
          cycleIdx = (cycleIdx + 1) % cycle.length;
          assigned = true;
        } else {
          cycleIdx = (cycleIdx + 1) % cycle.length;
          tries++;
        }
      }
      if (!assigned) {
        // R06 : fallback — assign first available
        const fallback = agents.find(a => isAvailable(a.nom, currentDate, recupMap));
        if (fallback) {
          result.push({ dateISO: currentDate, agentNom: fallback.nom, generated: true, fallback: true });
        }
      }
    }
    currentDate = addDays(currentDate, 1);
  }
  return result;
}

function buildFullPlanning() {
  STATE.planning = generatePlanning();
  saveState();
}

function rebuildFrom(dateISO) {
  // Rebuild planning from a given date forward, keeping past entries
  const past = STATE.planning.filter(p => p.dateISO < dateISO);
  const future = generatePlanning().filter(p => p.dateISO >= dateISO);
  STATE.planning = [...past, ...future];
  saveState();
}
