// Rendu des avatars agents

const AGENT_COLORS = [
  '#2563eb','#16a34a','#dc2626','#9333ea','#ea580c',
  '#0891b2','#65a30d','#db2777','#d97706','#4f46e5','#059669'
];

function getAgentColor(agentNom) {
  const agents = STATE.agents;
  const idx = agents.findIndex(a => a.nom === agentNom);
  return AGENT_COLORS[idx % AGENT_COLORS.length] || '#64748b';
}

function renderAvatar(agentNom, size = 32) {
  const agent = STATE.agents.find(a => a.nom === agentNom);
  if (agent && agent.photo && /^data:image\//.test(agent.photo)) {
    return `<img class="avatar" src="${agent.photo}" style="width:${size}px;height:${size}px;object-fit:cover" title="${escHtml(agentNom)}">`;
  }
  const initials = agentNom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = getAgentColor(agentNom);
  return `<span class="avatar" style="background:${color};width:${size}px;height:${size}px;font-size:${Math.floor(size*0.4)}px" title="${escHtml(agentNom)}">${escHtml(initials)}</span>`;
}
