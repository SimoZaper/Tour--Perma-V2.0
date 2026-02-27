// Dictionnaires FR/AR + fonction t()
const I18N = {
  fr: {
    app_title: 'Tour de Permanence',
    login: 'Connexion',
    logout: 'Déconnexion',
    username: 'Utilisateur',
    password: 'Mot de passe',
    tab1: 'Accueil',
    tab2: 'Tours précédents',
    tab3: 'Planning',
    tab4: 'Agents',
    tab5: 'Repos & Absences',
    tab6: 'Échanges',
    tab7: 'Tableau de bord',
    tab8: 'Historique',
    tab9: 'Paramètres',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    close: 'Fermer',
    export_pdf: 'Exporter PDF',
    export_excel: 'Exporter Excel',
    export_json: 'Exporter JSON',
    import_json: 'Importer JSON',
    agent: 'Agent',
    agents: 'Agents',
    date: 'Date',
    status: 'Statut',
    active: 'Actif',
    inactive: 'Inactif',
    duty: 'Permanence',
    rest: 'Repos',
    absence: 'Absence',
    exchange: 'Échange',
    settings_saved: 'Paramètres enregistrés',
    error_required: 'Champ obligatoire',
    error_date: 'Date invalide',
    confirm_delete: 'Confirmer la suppression ?',
    no_data: 'Aucune donnée',
    loading: 'Chargement…',
    generate: 'Générer',
    planning_generated: 'Planning généré avec succès',
    today: "Aujourd'hui",
    error_element_not_found: 'Élément introuvable',
    error_lib_pdf: 'Bibliothèque PDF non chargée',
    error_lib_excel: 'Bibliothèque Excel non chargée',
    error_import_json: 'Erreur import JSON',
    error_agents_different: 'Les deux agents doivent être différents',
    error_login: 'Identifiants incorrects',
    clear_logs: 'Vider les logs',
    reset_data: 'Réinitialiser les données',
    add_user: 'Ajouter utilisateur',
    nb_duties: 'Nb permanences',
    user: 'Utilisateur'
  },
  ar: {
    app_title: 'جدول النوبة',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    username: 'المستخدم',
    password: 'كلمة المرور',
    tab1: 'الرئيسية',
    tab2: 'النوبات السابقة',
    tab3: 'التخطيط',
    tab4: 'الأعوان',
    tab5: 'الراحة والغياب',
    tab6: 'التبادلات',
    tab7: 'لوحة القيادة',
    tab8: 'السجل',
    tab9: 'الإعدادات',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
    close: 'إغلاق',
    export_pdf: 'تصدير PDF',
    export_excel: 'تصدير Excel',
    export_json: 'تصدير JSON',
    import_json: 'استيراد JSON',
    agent: 'عون',
    agents: 'الأعوان',
    date: 'التاريخ',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',
    duty: 'نوبة',
    rest: 'راحة',
    absence: 'غياب',
    exchange: 'تبادل',
    settings_saved: 'تم حفظ الإعدادات',
    error_required: 'حقل مطلوب',
    error_date: 'تاريخ غير صالح',
    confirm_delete: 'تأكيد الحذف؟',
    no_data: 'لا توجد بيانات',
    loading: 'جارٍ التحميل…',
    generate: 'توليد',
    planning_generated: 'تم توليد الجدول بنجاح',
    today: 'اليوم',
    error_element_not_found: 'العنصر غير موجود',
    error_lib_pdf: 'مكتبة PDF غير محملة',
    error_lib_excel: 'مكتبة Excel غير محملة',
    error_import_json: 'خطأ في استيراد JSON',
    error_agents_different: 'يجب أن يكون العونان مختلفين',
    error_login: 'بيانات الاعتماد غير صحيحة',
    clear_logs: 'مسح السجلات',
    reset_data: 'إعادة تهيئة البيانات',
    add_user: 'إضافة مستخدم',
    nb_duties: 'عدد النوبات',
    user: 'مستخدم'
  }
};

function t(key) {
  return (I18N[STATE.lang] && I18N[STATE.lang][key]) || (I18N.fr[key]) || key;
}

function setLang(lang) {
  STATE.lang = lang;
  saveState();
  applyLang();
  renderCurrentTab();
}

function applyLang() {
  const isAr = STATE.lang === 'ar';
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', STATE.lang);
  // Update data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}
