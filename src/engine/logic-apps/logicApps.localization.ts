// Logic Apps Engine Localization
// Centralized localization strings for workflow visualization

import { SupportedLocale } from './logicApps.types';

interface LocalizationStrings {
  // Section headers
  triggers: string;
  actions: string;
  
  // Node labels
  trigger: string;
  action: string;
  condition: string;
  scope: string;
  loop: string;
  switch: string;
  workflow: string;
  variable: string;
  http: string;
  response: string;
  
  // UI labels
  selectLogicApp: string;
  noSelection: string;
  loading: string;
  runAfter: string;
  more: string;
  expand: string;
  collapse: string;
  
  // Status
  readOnlyMode: string;
  viewerMode: string;
}

/**
 * Localization bundles for supported languages
 */
const localizationBundles: Record<SupportedLocale, LocalizationStrings> = {
  en: {
    triggers: 'Triggers',
    actions: 'Actions',
    trigger: 'Trigger',
    action: 'Action',
    condition: 'Condition',
    scope: 'Scope',
    loop: 'Loop',
    switch: 'Switch',
    workflow: 'Workflow',
    variable: 'Variable',
    http: 'HTTP',
    response: 'Response',
    selectLogicApp: 'Select Logic App',
    noSelection: 'Select a Logic App to view its workflow',
    loading: 'Loading workflow...',
    runAfter: 'After',
    more: 'more',
    expand: 'Expand',
    collapse: 'Collapse',
    readOnlyMode: 'Read-only',
    viewerMode: 'Viewer Mode',
  },
  es: {
    triggers: 'Desencadenadores',
    actions: 'Acciones',
    trigger: 'Desencadenador',
    action: 'Acción',
    condition: 'Condición',
    scope: 'Ámbito',
    loop: 'Bucle',
    switch: 'Selector',
    workflow: 'Flujo de trabajo',
    variable: 'Variable',
    http: 'HTTP',
    response: 'Respuesta',
    selectLogicApp: 'Seleccionar Logic App',
    noSelection: 'Seleccione una Logic App para ver su flujo de trabajo',
    loading: 'Cargando flujo de trabajo...',
    runAfter: 'Después de',
    more: 'más',
    expand: 'Expandir',
    collapse: 'Contraer',
    readOnlyMode: 'Solo lectura',
    viewerMode: 'Modo visor',
  },
  de: {
    triggers: 'Trigger',
    actions: 'Aktionen',
    trigger: 'Trigger',
    action: 'Aktion',
    condition: 'Bedingung',
    scope: 'Bereich',
    loop: 'Schleife',
    switch: 'Schalter',
    workflow: 'Workflow',
    variable: 'Variable',
    http: 'HTTP',
    response: 'Antwort',
    selectLogicApp: 'Logic App auswählen',
    noSelection: 'Wählen Sie eine Logic App aus, um den Workflow anzuzeigen',
    loading: 'Workflow wird geladen...',
    runAfter: 'Nach',
    more: 'weitere',
    expand: 'Erweitern',
    collapse: 'Zuklappen',
    readOnlyMode: 'Schreibgeschützt',
    viewerMode: 'Anzeigemodus',
  },
  fr: {
    triggers: 'Déclencheurs',
    actions: 'Actions',
    trigger: 'Déclencheur',
    action: 'Action',
    condition: 'Condition',
    scope: 'Étendue',
    loop: 'Boucle',
    switch: 'Commutateur',
    workflow: 'Workflow',
    variable: 'Variable',
    http: 'HTTP',
    response: 'Réponse',
    selectLogicApp: 'Sélectionner Logic App',
    noSelection: 'Sélectionnez une Logic App pour afficher son workflow',
    loading: 'Chargement du workflow...',
    runAfter: 'Après',
    more: 'de plus',
    expand: 'Développer',
    collapse: 'Réduire',
    readOnlyMode: 'Lecture seule',
    viewerMode: 'Mode visualisation',
  },
  pt: {
    triggers: 'Gatilhos',
    actions: 'Ações',
    trigger: 'Gatilho',
    action: 'Ação',
    condition: 'Condição',
    scope: 'Escopo',
    loop: 'Loop',
    switch: 'Switch',
    workflow: 'Fluxo de trabalho',
    variable: 'Variável',
    http: 'HTTP',
    response: 'Resposta',
    selectLogicApp: 'Selecionar Logic App',
    noSelection: 'Selecione um Logic App para visualizar o fluxo de trabalho',
    loading: 'Carregando fluxo de trabalho...',
    runAfter: 'Após',
    more: 'mais',
    expand: 'Expandir',
    collapse: 'Recolher',
    readOnlyMode: 'Somente leitura',
    viewerMode: 'Modo de visualização',
  },
  ar: {
    triggers: 'المشغلات',
    actions: 'الإجراءات',
    trigger: 'مشغل',
    action: 'إجراء',
    condition: 'شرط',
    scope: 'نطاق',
    loop: 'حلقة',
    switch: 'مفتاح',
    workflow: 'سير العمل',
    variable: 'متغير',
    http: 'HTTP',
    response: 'استجابة',
    selectLogicApp: 'اختر Logic App',
    noSelection: 'اختر Logic App لعرض سير العمل',
    loading: 'جاري تحميل سير العمل...',
    runAfter: 'بعد',
    more: 'المزيد',
    expand: 'توسيع',
    collapse: 'طي',
    readOnlyMode: 'للقراءة فقط',
    viewerMode: 'وضع العرض',
  },
  zh: {
    triggers: '触发器',
    actions: '操作',
    trigger: '触发器',
    action: '操作',
    condition: '条件',
    scope: '作用域',
    loop: '循环',
    switch: '切换',
    workflow: '工作流',
    variable: '变量',
    http: 'HTTP',
    response: '响应',
    selectLogicApp: '选择逻辑应用',
    noSelection: '选择一个逻辑应用以查看其工作流',
    loading: '正在加载工作流...',
    runAfter: '之后',
    more: '更多',
    expand: '展开',
    collapse: '收起',
    readOnlyMode: '只读',
    viewerMode: '查看模式',
  },
};

/**
 * Get localization strings for a given locale
 */
export function getLocalizationStrings(locale: SupportedLocale): LocalizationStrings {
  return localizationBundles[locale] || localizationBundles.en;
}

/**
 * Translate a key to the current locale
 */
export function translate(key: keyof LocalizationStrings, locale: SupportedLocale): string {
  const strings = getLocalizationStrings(locale);
  return strings[key] || key;
}

/**
 * Check if locale is RTL (right-to-left)
 */
export function isRTL(locale: SupportedLocale): boolean {
  return locale === 'ar';
}
