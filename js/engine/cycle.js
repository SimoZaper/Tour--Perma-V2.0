// Moteur de rotation des agents (R01, R07, R08)
// Ces fonctions ne touchent JAMAIS au DOM.

function buildCycleFromPrevTours(agents) {
  // R01 : construit l'ordre de rotation à partir des tours précédents
  if (!STATE.prevTours || STATE.prevTours.length === 0) {
    return agents.map(a => a.nom);
  }
  const sorted = [...STATE.prevTours].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const lastAgents = [];
  const seen = new Set();
  for (const tour of sorted) {
    if (!seen.has(tour.agentNom)) {
      seen.add(tour.agentNom);
      lastAgents.push(tour.agentNom);
    }
  }
  // Agents who never had duty go first
  const neverDuty = agents.filter(a => !seen.has(a.nom)).map(a => a.nom);
  // Reverse lastAgents so most-recent duty = last in cycle
  return [...neverDuty, ...lastAgents.reverse()];
}

function calcCycleFromPrev(agents) {
  // Returns ordered array of agent names for upcoming rotation
  const cycle = buildCycleFromPrevTours(agents);
  // Filter to only active agents
  const activeNames = new Set(agents.map(a => a.nom));
  return cycle.filter(n => activeNames.has(n));
}

function getDutyAgentIdx(cycle, dateISO, assignedSoFar) {
  // R07 : finds next available agent in cycle (reserved for future multi-duty-per-day support)
  // assignedSoFar is a Set of agent names already assigned on dateISO
  for (let i = 0; i < cycle.length; i++) {
    if (!assignedSoFar.has(cycle[i])) return i;
  }
  return 0;
}

function rotateCycle(cycle, fromIdx) {
  // R08 : rotates cycle so next starts after fromIdx (reserved for future partial-rebuild use)
  return [...cycle.slice(fromIdx + 1), ...cycle.slice(0, fromIdx + 1)];
}
