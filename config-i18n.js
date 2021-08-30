import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import languages, {getCurrentLanguage} from './src/locales';

const initialize = async() => {
  const currentLocale = await getCurrentLanguage();

  i18n.use(initReactI18next).init({
    fallbackLng: 'en-US',
    lng: currentLocale,

    resources: languages,

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: false,

    // cache: {
    //   enabled: true
    // },

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

}


initialize();

export default i18n;
