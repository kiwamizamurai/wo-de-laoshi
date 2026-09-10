import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import type { VocabItem } from '../../data/types';

interface CardProps {
  item: VocabItem;
  revealed: boolean;
  onReveal: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export function Card({ item, revealed, onReveal, bookmarked, onToggleBookmark }: CardProps) {
  return (
    <div
      className="card"
      onClick={revealed ? undefined : onReveal}
      style={{
        position: 'relative',
        padding: 'clamp(1.5rem, 6vw, 2.5rem) 1.25rem',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        textAlign: 'center',
        cursor: revealed ? 'default' : 'pointer',
      }}
    >
      <button
        onClick={(event: any) => {
          event.stopPropagation();
          onToggleBookmark();
        }}
        aria-label={bookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
        style={{
          position: 'absolute',
          top: '0.6rem',
          right: '0.6rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.4rem',
          lineHeight: 1,
          padding: '0.3rem',
          color: bookmarked ? 'var(--color-warning)' : 'var(--color-text-muted)',
        }}
      >
        {bookmarked ? '★' : '☆'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="hanzi" style={{ fontSize: 'clamp(1.8rem, 9vw, 2.4rem)', fontWeight: 700 }}>
          {item.hanzi}
        </span>
        <SpeakButton text={item.hanzi} />
        <CopyButton text={item.hanzi} />
      </div>
      <span className="muted" style={{ fontSize: '1.1rem' }}>
        {item.pinyin}
      </span>
      {revealed ? (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <strong style={{ fontSize: '1.2rem' }}>{item.meaning}</strong>
          {item.exampleSentence ? (
            <div style={{ marginTop: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span className="hanzi">{item.exampleSentence}</span>
                <SpeakButton text={item.exampleSentence} />
                <CopyButton text={item.exampleSentence} />
              </div>
              <div className="muted">{item.exampleSentencePinyin}</div>
              <div className="muted">{item.exampleSentenceMeaning}</div>
            </div>
          ) : null}
        </div>
      ) : (
        <span className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
          タップして意味を表示
        </span>
      )}
    </div>
  );
}
