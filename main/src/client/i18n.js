import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {store} from '#c/functions/store';
import fa from '#c/language/fa/translation';
import en from '#c/language/en/translation';
import { setLanguage } from '#c/functions/index';

if (!store.getState().store.lan) setLanguage('en');

// the translations
const resources = {
  fa: {
    translation: fa(),
  },
    en: {
    translation: en(),
  },
};

export default i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: store.getState().store.lan || 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
