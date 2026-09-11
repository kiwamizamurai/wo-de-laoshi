import { useT } from '../../i18n/LocaleContext';

interface PinyinLineProps {
  pinyin: string | null;
  loading: boolean;
}

export function PinyinLine({ pinyin, loading }: PinyinLineProps) {
  const t = useT();
  if (!loading && !pinyin) return null;
  return (
    <span className="muted anim-fade-in" style={{ fontSize: '1rem' }}>
      {loading ? t.translate.pinyinLoading : pinyin}
    </span>
  );
}
