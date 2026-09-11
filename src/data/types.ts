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

export interface GrammarExample {
  hanzi: string;
  pinyin: string;
  meaning: string;
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
  title: string;
  englishGrammarRef: string;
  category: GrammarCategory;
  pattern: string;
  explanationJa: string;
  examples: GrammarExample[];
}

export const GRAMMAR_CATEGORY_LABELS: Record<GrammarCategory, string> = {
  'word-order': '語順(SVO)',
  'tense-aspect': '時制・アスペクト',
  negation: '否定文',
  question: '疑問文',
  exclamation: '感嘆文',
  comparison: '比較級',
  modal: '助動詞',
  complement: '補語・不定詞',
  particle: '助詞(的/地/得/被)',
};
