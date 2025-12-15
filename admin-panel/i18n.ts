import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTrans from './locales/en/translation.json';
import viTrans from './locales/vi/translation.json';
import enCommon from './locales/en/common.json';
import viCommon from './locales/vi/common.json';
import enUser from './locales/en/user.json';
import viUser from './locales/vi/user.json';
import enValidation from './locales/en/validation.json';
import viValidation from './locales/vi/validation.json';

const resources = {
  en: {
    translation: enTrans,
    common: enCommon,
    user: enUser,
    validation: enValidation,
  },
  vi: {
    translation: viTrans,
    common: viCommon,
    user: viUser,
    validation: viValidation,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common', 'user', 'validation'], // khai báo namespace
    defaultNS: 'translation',
    debug: true,
    resources,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
