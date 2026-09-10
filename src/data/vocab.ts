import phrasesData from './phrases.json';
import wordsData from './words.json';
import type { VocabItem } from './types';

export const ALL_VOCAB_ITEMS: VocabItem[] = [...(wordsData as VocabItem[]), ...(phrasesData as VocabItem[])];
