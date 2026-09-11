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
  meaning: string;
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
  meaning: string;
  category: VocabCategory;
  example?: VocabExample;
  typing: PinyinKey[][];
}

export interface ChatScenario {
  id: string;
  title: string;
  descriptionJa: string;
  hskLevel: 1 | 2 | 3;
  systemPrompt: string;
  starterMessage: string;
  suggestedPhraseIds: string[];
}

export const CATEGORY_LABELS: Record<VocabCategory, string> = {
  greetings: 'あいさつ・基本表現',
  'self-intro': '自己紹介',
  'numbers-time': '数字・時間',
  travel: '旅行・交通',
  food: '飲食',
  shopping: '買い物',
  'daily-life': '日常生活',
  directions: '方向・場所',
  phrase: '実用フレーズ',
  'daily-conversation': '日常会話',
  'friend-chat': '友達との会話',
  'reading-notes': '読解メモ',
  workplace: '職場での会話',
  mealtime: '食事中の会話',
  'small-talk': '雑談',
};
