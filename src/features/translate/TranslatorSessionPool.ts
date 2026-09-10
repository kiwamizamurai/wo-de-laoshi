import { createTranslator, type LanguagePair } from '../../ai/translatorApi';
import type { ProgressHandler } from '../../ai/types';

function poolKey(pair: LanguagePair): string {
  return `${pair.sourceLanguage}->${pair.targetLanguage}`;
}

/** 言語ペアごとにTranslatorインスタンスをキャッシュし、同一ペアの再ダウンロードを防ぐ。 */
export class TranslatorSessionPool {
  #cache = new Map<string, Promise<any>>();

  get(pair: LanguagePair, onProgress?: ProgressHandler): Promise<any> {
    const key = poolKey(pair);
    const cached = this.#cache.get(key);
    if (cached) return cached;
    const created = createTranslator(pair, onProgress);
    this.#cache.set(key, created);
    return created;
  }

  clear(): void {
    this.#cache.clear();
  }
}
