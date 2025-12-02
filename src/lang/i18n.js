import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enUS from './en-US.json';
import trTR from './tr-TR.json';

const resources = {
  'en-US': enUS,
  'tr-TR': trTR,
};

i18n

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en-US', // default language to use.
    fallbackLng: 'en-US',
  });

export default {i18n};
