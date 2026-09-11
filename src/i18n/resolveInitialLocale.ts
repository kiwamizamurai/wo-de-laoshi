import type { Locale } from './types';
import { detectLocale } from './detectLocale';
import { loadStoredLocale } from './storage';

export function resolveInitialLocale(nav?: Parameters<typeof detectLocale>[0]): Locale {
  return loadStoredLocale() ?? detectLocale(nav);
}
