import en from './en-US';
import es from './es-MX';

import {getLanguage, setLanguage} from '../helper';

export const locales = ['en-US', 'es-MX'];

export const getCurrentLanguage = async() => {
  return await getLanguage();
}

export const setCurrentLanguage = async(language) => {
  return await setLanguage(language);
}

export default {
  en,
  es,
}
