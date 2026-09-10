import { getTranslatorAvailability, isTranslatorApiSupported } from '../../ai/translatorApi';
import { useAiAvailability } from '../../ai/useAiAvailability';
import { TranslatorSessionPool } from './TranslatorSessionPool';

const pool = new TranslatorSessionPool();

export function useTranslatorSession(sourceLanguage: string, targetLanguage: string) {
  return useAiAvailability(
    {
      isSupported: isTranslatorApiSupported,
      checkAvailability: () => getTranslatorAvailability({ sourceLanguage, targetLanguage }),
      createInstance: (onProgress) => pool.get({ sourceLanguage, targetLanguage }, onProgress),
    },
    [sourceLanguage, targetLanguage],
  );
}
