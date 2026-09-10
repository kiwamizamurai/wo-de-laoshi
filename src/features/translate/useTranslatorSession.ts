import { getTranslatorAvailability, isTranslatorApiSupported } from '../../ai/translatorApi';
import { useAiAvailability } from '../../ai/useAiAvailability';
import { getSharedWebLLMEngine, getWebLLMAvailability, isWebLLMSupported } from '../../ai/webllmApi';
import { isMobileDevice } from '../../lib/device';
import { TranslatorSessionPool } from './TranslatorSessionPool';
import { WebLLMTranslatorAdapter } from './WebLLMTranslatorAdapter';

const pool = new TranslatorSessionPool();

export function useTranslatorSession(sourceLanguage: string, targetLanguage: string) {
  const mobile = isMobileDevice();

  const chromeAi = useAiAvailability(
    {
      isSupported: () => !mobile && isTranslatorApiSupported(),
      checkAvailability: () => getTranslatorAvailability({ sourceLanguage, targetLanguage }),
      createInstance: (onProgress) => pool.get({ sourceLanguage, targetLanguage }, onProgress),
    },
    [sourceLanguage, targetLanguage, mobile],
  );

  const webllm = useAiAvailability(
    {
      isSupported: () => mobile && isWebLLMSupported(),
      checkAvailability: getWebLLMAvailability,
      createInstance: async (onProgress) => {
        const engine = await getSharedWebLLMEngine(onProgress);
        return new WebLLMTranslatorAdapter(engine, { sourceLanguage, targetLanguage });
      },
    },
    [sourceLanguage, targetLanguage, mobile],
  );

  return mobile ? webllm : chromeAi;
}
