import type { Locale } from './types';

interface NavigatorLike {
  language?: string;
}

export function detectLocale(nav: NavigatorLike = navigator): Locale {
  const lang = nav.language ?? '';
  return lang.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}
