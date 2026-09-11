import { describe, expect, it } from 'vitest';
import { ALL_GRAMMAR_POINTS } from './grammar';
import { GRAMMAR_CATEGORY_LABELS } from './types';

describe('ALL_GRAMMAR_POINTS', () => {
  it('idが重複しない', () => {
    const ids = ALL_GRAMMAR_POINTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('categoryはすべてGRAMMAR_CATEGORY_LABELSに定義された値である', () => {
    const validCategories = new Set(Object.keys(GRAMMAR_CATEGORY_LABELS));
    for (const point of ALL_GRAMMAR_POINTS) {
      expect(validCategories.has(point.category)).toBe(true);
    }
  });

  it('各文法ポイントはtitle/englishGrammarRef/pattern/explanationJaが空でない', () => {
    for (const point of ALL_GRAMMAR_POINTS) {
      expect(point.title.length).toBeGreaterThan(0);
      expect(point.englishGrammarRef.length).toBeGreaterThan(0);
      expect(point.pattern.length).toBeGreaterThan(0);
      expect(point.explanationJa.length).toBeGreaterThan(0);
    }
  });

  it('各文法ポイントは例文を2件以上持つ', () => {
    for (const point of ALL_GRAMMAR_POINTS) {
      expect(point.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of point.examples) {
        expect(example.hanzi.length).toBeGreaterThan(0);
        expect(example.pinyin.length).toBeGreaterThan(0);
        expect(example.meaning.length).toBeGreaterThan(0);
      }
    }
  });
});
