// Toutes les constantes en un seul endroit
const STORAGE_KEY             = 'perm_exp_v1';
const DAYS_BEFORE_TODAY       = 2;
const DAYS_AHEAD              = 22;
const DEFAULT_ALERT_THRESHOLD = 30;
const MAX_LOGS_RETAINED       = 1000;
const MAX_CONNEXIONS_RETAINED = 200;
const HASH_SALT               = 'EXP_PERM_2025';

const AGENTS_INIT = [
  { id: 1,  nom: 'Agent 1',  matricule: 1001, actif: true },
  { id: 2,  nom: 'Agent 2',  matricule: 1002, actif: true },
  { id: 3,  nom: 'Agent 3',  matricule: 1003, actif: true },
  { id: 4,  nom: 'Agent 4',  matricule: 1004, actif: true },
  { id: 5,  nom: 'Agent 5',  matricule: 1005, actif: true },
  { id: 6,  nom: 'Agent 6',  matricule: 1006, actif: true },
  { id: 7,  nom: 'Agent 7',  matricule: 1007, actif: true },
  { id: 8,  nom: 'Agent 8',  matricule: 1008, actif: true },
  { id: 9,  nom: 'Agent 9',  matricule: 1009, actif: true },
  { id: 10, nom: 'Agent 10', matricule: 1010, actif: true },
  { id: 11, nom: 'Agent 11', matricule: 1011, actif: true }
];

const JOURS_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const JOURS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MOIS_FR  = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MOIS_AR  = ['يناير','فبراير','مارس','أبريل','ماي','يونيو',
                  'يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];
