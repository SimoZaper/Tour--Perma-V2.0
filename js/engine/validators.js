// Validation des données avant sauvegarde

function validateAgent(agent) {
  const errors = [];
  if (!agent.nom || !agent.nom.trim()) errors.push(t('error_required') + ': nom');
  if (!agent.matricule) errors.push(t('error_required') + ': matricule');
  return errors;
}

function validateAbsence(absence) {
  const errors = [];
  if (!absence.agent) errors.push(t('error_required') + ': agent');
  if (!absence.debut) errors.push(t('error_required') + ': debut');
  if (!absence.fin) errors.push(t('error_required') + ': fin');
  if (absence.debut && absence.fin && absence.debut > absence.fin) {
    errors.push(t('error_date'));
  }
  return errors;
}

function validateEchange(echange) {
  const errors = [];
  if (!echange.agent1) errors.push(t('error_required') + ': agent1');
  if (!echange.agent2) errors.push(t('error_required') + ': agent2');
  if (!echange.date1)  errors.push(t('error_required') + ': date1');
  if (!echange.date2)  errors.push(t('error_required') + ': date2');
  if (echange.agent1 && echange.agent2 && echange.agent1 === echange.agent2) {
    errors.push('Les deux agents doivent être différents');
  }
  return errors;
}
