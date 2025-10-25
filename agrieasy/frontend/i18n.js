const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: {
        translation: require('./public/locales/en/common.json')
      },
      hi: {
        translation: require('./public/locales/hi/common.json')
      },
      ta: {
        translation: require('./public/locales/ta/common.json')
      },
      te: {
        translation: require('./public/locales/te/common.json')
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

module.exports = i18n;
