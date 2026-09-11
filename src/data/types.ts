export interface Localized {
  ja: string;
  en: string;
}

export type VocabCategory =
  | 'greetings'
  | 'self-intro'
  | 'numbers-time'
  | 'travel'
  | 'food'
  | 'shopping'
  | 'daily-life'
  | 'directions'
  | 'phrase'
  | 'daily-conversation'
  | 'friend-chat'
  | 'reading-notes'
  | 'workplace'
  | 'mealtime'
  | 'small-talk';

export interface VocabExample {
  sentence: string;
  pinyin: string;
  meaning: Localized;
}

export const PINYIN_KEYS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const;

export type PinyinKey = (typeof PINYIN_KEYS)[number];

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: Localized;
  category: VocabCategory;
  example?: VocabExample;
  typing: PinyinKey[][];
}

export interface ChatScenario {
  id: string;
  title: Localized;
  description: Localized;
  hskLevel: 1 | 2 | 3;
  systemPrompt: Localized;
  starterMessage: Localized;
  suggestedPhraseIds: string[];
}

export interface GrammarExample {
  hanzi: string;
  pinyin: string;
  meaning: Localized;
}

export type GrammarCategory =
  | 'word-order'
  | 'tense-aspect'
  | 'negation'
  | 'question'
  | 'exclamation'
  | 'comparison'
  | 'modal'
  | 'complement'
  | 'particle';

export interface GrammarPoint {
  id: string;
  title: Localized;
  englishGrammarRef: Localized;
  category: GrammarCategory;
  pattern: Localized;
  explanation: Localized;
  examples: GrammarExample[];
}
