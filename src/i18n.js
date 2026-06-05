import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uz from './locales/uz.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

const supportedLanguages = ['uz', 'ru', 'en']
const savedLanguage = localStorage.getItem('app-language')
const initialLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'uz'

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'uz',
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', language => {
  localStorage.setItem('app-language', language)
})

export default i18n
