import type { Locale } from '../i18n/types';
import type { Localized } from './types';

export function pickLocalized(value: Localized, locale: Locale): string {
  return value[locale];
}
