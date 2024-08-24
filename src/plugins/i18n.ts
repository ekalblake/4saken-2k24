
import languageEn from "../labels/languageEN";
import languageEs from "../labels/languageES";

import { createI18n } from 'vue-i18n';

// Importa las traducciones (puedes tener más archivos de idiomas)
const messages = {
  en: languageEn,
  es: languageEs,
};

const i18n = createI18n({
  legacy: false,
  locale: 'es', 
  fallbackLocale: 'es',
  messages,
  globalInjection: true,
});

export default i18n;