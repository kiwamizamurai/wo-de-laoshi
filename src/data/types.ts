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
  | 'reading-notes';

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  category: VocabCategory;
  hskLevel: 1 | 2 | 3;
  exampleSentence?: string;
  exampleSentencePinyin?: string;
  exampleSentenceMeaning?: string;
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
  'reading-notes': '読解メモ',
};
