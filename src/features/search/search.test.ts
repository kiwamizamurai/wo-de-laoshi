import { describe, expect, it } from 'vitest';
import type { ChatScenario, VocabItem } from '../../data/types';
import { normalizePinyin, normalizeText, searchScenarios, searchVocab } from './search';

function makeItem(overrides: Partial<VocabItem>): VocabItem {
  return {
    id: 'test-001',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'こんにちは',
    category: 'greetings',
    typing: [
      ['n', 'i'],
      ['h', 'a', 'o'],
    ],
    ...overrides,
  };
}

describe('normalizeText', () => {
  it('全角英数字を半角に、大文字を小文字に統一し前後の空白を除去する', () => {
    expect(normalizeText('  ＡＢＣ　taxi  ')).toBe('abc taxi');
  });
});

describe('normalizePinyin', () => {
  it('声調記号を除去する', () => {
    expect(normalizePinyin('nǐ hǎo')).toBe('nihao');
  });

  it('アポストロフィと空白を除去する', () => {
    expect(normalizePinyin("wǎn'ān")).toBe('wanan');
  });
});

describe('searchVocab', () => {
  const items = [
    makeItem({ id: 'greetings-001', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'こんにちは' }),
    makeItem({
      id: 'phrase-taxi',
      hanzi: '出租车',
      pinyin: 'chūzūchē',
      meaning: 'タクシー',
      category: 'travel',
    }),
    makeItem({
      id: 'phrase-health',
      hanzi: '我有点不舒服。',
      pinyin: 'wǒ yǒudiǎn bù shūfu.',
      meaning: '少し体調が悪いです。',
      category: 'phrase',
    }),
  ];

  it('日本語の意味(meaning)の部分一致でヒットする', () => {
    const results = searchVocab(items, 'タクシー');
    expect(results.map((r) => r.item.id)).toContain('phrase-taxi');
  });

  it('exampleSentenceMeaningがundefinedでも例外を投げない', () => {
    expect(() => searchVocab(items, '体調')).not.toThrow();
    const results = searchVocab(items, '体調');
    expect(results.map((r) => r.item.id)).toContain('phrase-health');
  });

  it('声調なしピンインでもヒットする', () => {
    const results = searchVocab(items, 'nihao');
    expect(results.map((r) => r.item.id)).toContain('greetings-001');
  });

  it('中国語(hanzi)の部分一致でもヒットする', () => {
    const results = searchVocab(items, '出租车');
    expect(results.map((r) => r.item.id)).toContain('phrase-taxi');
  });

  it('空クエリは空配列を返す', () => {
    expect(searchVocab(items, '')).toEqual([]);
    expect(searchVocab(items, '   ')).toEqual([]);
  });

  it('該当なしのクエリは空配列を返す', () => {
    expect(searchVocab(items, 'xyz存在しない')).toEqual([]);
  });

  it('meaning一致はexampleSentenceのみの一致より高いスコアになる', () => {
    const meaningMatch = makeItem({ id: 'a', meaning: 'ようこそ' });
    const exampleOnlyMatch = makeItem({
      id: 'b',
      meaning: '別の意味',
      example: { sentence: '欢迎光临', pinyin: 'huānyíng guānglín', meaning: 'ようこそいらっしゃいませ' },
    });
    const results = searchVocab([exampleOnlyMatch, meaningMatch], 'ようこそ');
    expect(results[0].item.id).toBe('a');
  });
});

describe('searchScenarios', () => {
  const scenarios: ChatScenario[] = [
    {
      id: 'taxi-ride',
      title: 'タクシーで行き先を伝える',
      descriptionJa: '運転手に目的地を伝える練習',
      hskLevel: 1,
      systemPrompt: '',
      starterMessage: '',
      suggestedPhraseIds: [],
    },
    {
      id: 'cafe-order',
      title: 'カフェで注文する',
      descriptionJa: '飲み物を注文する練習',
      hskLevel: 1,
      systemPrompt: '',
      starterMessage: '',
      suggestedPhraseIds: [],
    },
  ];

  it('titleの部分一致でヒットする', () => {
    const results = searchScenarios(scenarios, 'タクシー');
    expect(results.map((r) => r.scenario.id)).toEqual(['taxi-ride']);
  });

  it('該当なし・空クエリは空配列を返す', () => {
    expect(searchScenarios(scenarios, '')).toEqual([]);
    expect(searchScenarios(scenarios, '存在しない語句')).toEqual([]);
  });
});
