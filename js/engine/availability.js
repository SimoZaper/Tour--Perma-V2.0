// Règles de disponibilité des agents (R02-R04)
// Ces fonctions ne touchent JAMAIS au DOM.

function getRecupISO(dutyISO) {
  // R03 : si samedi → récup mardi, sinon lendemain
  return dowOf(dutyISO) === 6 ? addDays(dutyISO, 3) : addDays(dutyISO, 1);
}

function isOnLeave(agentNom, dateISO) {
  return STATE.repos.some(r =>
    r.agent === agentNom && r.debut <= dateISO && r.fin >= dateISO
  );
}

function isDay1Return(agentNom, dateISO) {
  // R04 : J+1 after duty is rest day (recup)
  return STATE.planning.some(p =>
    p.agentNom === agentNom && getRecupISO(p.dateISO) === dateISO
  );
}

function isAvailable(agentNom, dateISO, recupMap) {
  const recupSet = (recupMap && recupMap[dateISO]) ? recupMap[dateISO] : new Set();
  return !isOnLeave(agentNom, dateISO)
      && !isDay1Return(agentNom, dateISO)
      && !recupSet.has(agentNom);
}

function buildRecupMap(planningArr) {
  const map = {};
  planningArr.forEach(p => {
    const r = getRecupISO(p.dateISO);
    if (!map[r]) map[r] = new Set();
    map[r].add(p.agentNom);
  });
  return map;
}
