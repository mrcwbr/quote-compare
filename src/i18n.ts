import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './locales/de'
import en from './locales/en'

const LANG_KEY = 'haus-sanierung-lang'

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: localStorage.getItem(LANG_KEY) ?? 'de',
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
})

export { LANG_KEY }
export default i18n
