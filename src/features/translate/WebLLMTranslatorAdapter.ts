import type { MLCEngine } from '@mlc-ai/web-llm';
import { webllmChatComplete } from '../../ai/webllmApi';
import type { LanguagePair } from '../../ai/translatorApi';

const LANGUAGE_NAMES: Record<string, string> = { zh: '中国語(簡体字)', ja: '日本語' };

function buildSystemPrompt(pair: LanguagePair): string {
  const from = LANGUAGE_NAMES[pair.sourceLanguage] ?? pair.sourceLanguage;
  const to = LANGUAGE_NAMES[pair.targetLanguage] ?? pair.targetLanguage;
  return (
    `あなたは${from}から${to}への翻訳者です。ユーザーが入力した${from}のテキストを${to}に翻訳してください。` +
    '説明・前置き・注釈は一切付けず、翻訳結果の本文のみを返してください。'
  );
}

export class WebLLMTranslatorAdapter {
  #engine: MLCEngine;
  #systemPrompt: string;

  constructor(engine: MLCEngine, pair: LanguagePair) {
    this.#engine = engine;
    this.#systemPrompt = buildSystemPrompt(pair);
  }

  async translate(text: string): Promise<string> {
    return webllmChatComplete(this.#engine, this.#systemPrompt, text);
  }
}
