import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import type { VocabItem } from '../../data/types';

interface SearchResultRowProps {
  item: VocabItem;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  index?: number;
}

export function SearchResultRow({ item, bookmarked, onToggleBookmark, index = 0 }: SearchResultRowProps) {
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
          aria-label={bookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
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
      <strong style={{ fontSize: '1rem' }}>{item.meaning}</strong>
      {item.exampleSentence ? (
        <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
          <span className="hanzi">{item.exampleSentence}</span>
          <div className="muted">{item.exampleSentencePinyin}</div>
          <div className="muted">{item.exampleSentenceMeaning}</div>
        </div>
      ) : null}
    </div>
  );
}
