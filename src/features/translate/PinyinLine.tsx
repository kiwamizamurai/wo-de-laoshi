interface PinyinLineProps {
  pinyin: string | null;
  loading: boolean;
}

export function PinyinLine({ pinyin, loading }: PinyinLineProps) {
  if (!loading && !pinyin) return null;
  return (
    <span className="muted" style={{ fontSize: '1rem' }}>
      {loading ? 'ピンインを取得しています...' : pinyin}
    </span>
  );
}
