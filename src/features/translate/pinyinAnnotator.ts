import { createPromptSession, destroySession, promptStructured } from '../../ai/promptApi';

export interface PinyinResult {
  pinyin: string;
}

const PINYIN_SCHEMA = {
  type: 'object',
  properties: {
    pinyin: { type: 'string' },
  },
  required: ['pinyin'],
};

const PINYIN_SYSTEM_PROMPT =
  'あなたは中国語のピンイン変換アシスタントです。与えられた簡体字中国語のテキストに対し、' +
  '声調記号付きのピンインを単語区切りのスペースで示してください。多音字は文脈に応じた正しい発音を選んでください。' +
  '句読点や中国語以外の文字はそのまま残してください。必ず指定のJSON形式のみで返答してください。';

export async function fetchPinyin(hanziText: string): Promise<string> {
  const session = await createPromptSession({ systemPrompt: PINYIN_SYSTEM_PROMPT });
  try {
    const { pinyin } = await promptStructured<PinyinResult>(session, hanziText, PINYIN_SCHEMA);
    return pinyin;
  } finally {
    destroySession(session);
  }
}
