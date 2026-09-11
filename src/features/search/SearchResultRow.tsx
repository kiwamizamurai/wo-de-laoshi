import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import { pickLocalized } from '../../data/localized';
import type { VocabItem } from '../../data/types';
import { useLocale, useT } from '../../i18n/LocaleContext';

interface SearchResultRowProps {
  item: VocabItem;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  index?: number;
}

export function SearchResultRow({ item, bookmarked, onToggleBookmark, index = 0 }: SearchResultRowProps) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <div
      className="card anim-slide-up-in"
      style={{
        padding: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        animationDelay: `${index * 30}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="hanzi" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {item.hanzi}
          </span>
          <SpeakButton text={item.hanzi} />
          <CopyButton text={item.hanzi} />
        </div>
        <button
          className="tap-scale"
          onClick={(event: any) => {
            event.stopPropagation();
            onToggleBookmark();
          }}
          aria-label={bookmarked ? t.flashcards.bookmarkRemove : t.flashcards.bookmarkAdd}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            color: bookmarked ? 'var(--color-warning)' : 'var(--color-text-muted)',
          }}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
      <span className="muted" style={{ fontSize: '0.9rem' }}>
        {item.pinyin}
      </span>
      <strong style={{ fontSize: '1rem' }}>{pickLocalized(item.meaning, locale)}</strong>
      {item.example ? (
        <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
          <span className="hanzi">{item.example.sentence}</span>
          <div className="muted">{item.example.pinyin}</div>
          <div className="muted">{pickLocalized(item.example.meaning, locale)}</div>
        </div>
      ) : null}
    </div>
  );
}
