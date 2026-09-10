import { CATEGORY_LABELS, type ChatScenario, type VocabItem } from '../../data/types';

const RESULT_LIMIT = 40;

const FIELD_WEIGHTS = {
  meaning: 100,
  exampleSentenceMeaning: 70,
  hanzi: 60,
  exampleSentence: 40,
  pinyin: 30,
  category: 20,
} as const;

export function normalizeText(input: string): string {
  return input.normalize('NFKC').toLowerCase().trim();
}

export function normalizePinyin(input: string): string {
  return normalizeText(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/\s+/g, '');
}

export interface VocabSearchResult {
  item: VocabItem;
  score: number;
}

export interface ScenarioSearchResult {
  scenario: ChatScenario;
  score: number;
}

export interface SearchResults {
  vocab: VocabSearchResult[];
  scenarios: ScenarioSearchResult[];
  vocabTotalCount: number;
}

function scoreVocabItem(item: VocabItem, query: string, normalizedQuery: string, pinyinQuery: string): number {
  let score = 0;
  if (normalizeText(item.meaning).includes(normalizedQuery)) score += FIELD_WEIGHTS.meaning;
  if (item.exampleSentenceMeaning && normalizeText(item.exampleSentenceMeaning).includes(normalizedQuery)) {
    score += FIELD_WEIGHTS.exampleSentenceMeaning;
  }
  if (item.hanzi.includes(query)) score += FIELD_WEIGHTS.hanzi;
  if (item.exampleSentence && item.exampleSentence.includes(query)) score += FIELD_WEIGHTS.exampleSentence;
  if (normalizePinyin(item.pinyin).includes(pinyinQuery)) score += FIELD_WEIGHTS.pinyin;
  if (normalizeText(CATEGORY_LABELS[item.category]).includes(normalizedQuery)) score += FIELD_WEIGHTS.category;
  return score;
}

export function searchVocab(items: VocabItem[], query: string): SearchResults['vocab'] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const normalizedQuery = normalizeText(trimmed);
  const pinyinQuery = normalizePinyin(trimmed);

  const scored: VocabSearchResult[] = [];
  for (const item of items) {
    const score = scoreVocabItem(item, trimmed, normalizedQuery, pinyinQuery);
    if (score > 0) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function searchScenarios(scenarios: ChatScenario[], query: string): SearchResults['scenarios'] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const normalizedQuery = normalizeText(trimmed);

  const scored: ScenarioSearchResult[] = [];
  for (const scenario of scenarios) {
    let score = 0;
    if (normalizeText(scenario.title).includes(normalizedQuery)) score += 100;
    if (normalizeText(scenario.descriptionJa).includes(normalizedQuery)) score += 70;
    if (score > 0) scored.push({ scenario, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function search(items: VocabItem[], scenarios: ChatScenario[], query: string): SearchResults {
  const vocab = searchVocab(items, query);
  return {
    vocab: vocab.slice(0, RESULT_LIMIT),
    scenarios: searchScenarios(scenarios, query),
    vocabTotalCount: vocab.length,
  };
}
