import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import kn from './locales/kn.json';
import or from './locales/or.json';
import ur from './locales/ur.json';

const dictionaries = {
  en, hi, bn, mr, ta, te, gu, ml, pa, kn, or, ur
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
