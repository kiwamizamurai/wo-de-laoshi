export type ParsedAiReply =
  | { kind: 'structured'; hanzi: string; pinyin: string; meaningText: string }
  | { kind: 'raw'; text: string };

/** AI応答の「中国語/(ピンイン)/訳文」3行フォーマットをパースする。失敗時は生テキストにフォールバック。 */
export function parseAiReply(raw: string): ParsedAiReply {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 3) {
    const [hanzi, pinyinLine, meaningText] = lines;
    const pinyinMatch = pinyinLine.match(/^\(?(.+?)\)?$/);
    const pinyin = pinyinMatch ? pinyinMatch[1] : pinyinLine;
    if (hanzi && pinyin && meaningText) {
      return { kind: 'structured', hanzi, pinyin, meaningText };
    }
  }
  return { kind: 'raw', text: raw };
}
