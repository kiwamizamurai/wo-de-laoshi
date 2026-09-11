import type { Locale } from './types';

const STORAGE_KEY = 'wdl:locale:v1';

function isLocale(value: string | null): value is Locale {
  return value === 'ja' || value === 'en';
}

export function loadStoredLocale(): Locale | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveStoredLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
}
