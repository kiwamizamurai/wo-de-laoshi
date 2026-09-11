import type { Dictionary, Locale } from './types';
import { en } from './locales/en';
import { ja } from './locales/ja';

export const DICTIONARIES: Record<Locale, Dictionary> = { ja, en };
