import type { AvailabilityState, ProgressHandler } from './types';

function getTranslator(): any {
  return (globalThis as any).Translator;
}

export function isTranslatorApiSupported(): boolean {
  return typeof getTranslator() !== 'undefined';
}

export interface LanguagePair {
  sourceLanguage: string;
  targetLanguage: string;
}

export async function getTranslatorAvailability(pair: LanguagePair): Promise<AvailabilityState> {
  if (!isTranslatorApiSupported()) return 'unavailable';
  try {
    return await getTranslator().availability(pair);
  } catch {
    return 'unavailable';
  }
}

export async function createTranslator(pair: LanguagePair, onProgress?: ProgressHandler): Promise<any> {
  const Translator = getTranslator();
  return Translator.create({
    ...pair,
    monitor(monitorTarget: EventTarget) {
      monitorTarget.addEventListener('downloadprogress', (event: any) => {
        onProgress?.(event.loaded ?? 0);
      });
    },
  });
}

export async function translateText(translator: any, text: string): Promise<string> {
  return translator.translate(text);
}
