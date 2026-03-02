// Toutes les constantes en un seul endroit
const STORAGE_KEY             = 'perm_exp_v1';
const DAYS_BEFORE_TODAY       = 2;
const DAYS_AHEAD              = 22;
const DEFAULT_ALERT_THRESHOLD = 30;
const MAX_LOGS_RETAINED       = 1000;
const MAX_CONNEXIONS_RETAINED = 200;
const HASH_SALT               = 'EXP_PERM_2025';

const AGENTS_INIT = [
  { id: 1,  nom: 'Tbeur',    matricule: 46881, actif: true, photo: null },
  { id: 2,  nom: 'Bennaji',  matricule: 51220, actif: true, photo: null },
  { id: 3,  nom: 'Brakech',  matricule: 58967, actif: true, photo: null },
  { id: 4,  nom: 'Filahi',   matricule: 59085, actif: true, photo: null },
  { id: 5,  nom: 'Baha',     matricule: 60822, actif: true, photo: null },
  { id: 6,  nom: 'Future',   matricule: 66009, actif: true, photo: null },
  { id: 7,  nom: 'Amzil',    matricule: 66219, actif: true, photo: null },
  { id: 8,  nom: 'Founoun',  matricule: 69155, actif: true, photo: null },
  { id: 9,  nom: 'Bouchait', matricule: 75285, actif: true, photo: null },
  { id: 10, nom: 'Oudli',    matricule: 75466, actif: true, photo: null },
  { id: 11, nom: 'Sejni',    matricule: 75743, actif: true, photo: null }
];

const JOURS_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const JOURS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MOIS_FR  = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MOIS_AR  = ['يناير','فبراير','مارس','أبريل','ماي','يونيو',
                  'يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'];
