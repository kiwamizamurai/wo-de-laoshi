import { useRef } from 'hono/jsx/dom';
import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import { replayAnimation } from '../../lib/animation';
import { pickLocalized } from '../../data/localized';
import type { VocabItem } from '../../data/types';
import { useLocale, useT } from '../../i18n/LocaleContext';

interface CardProps {
  item: VocabItem;
  revealed: boolean;
  onReveal: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  exitDirection?: 'left' | 'right' | null;
}

export function Card({ item, revealed, onReveal, bookmarked, onToggleBookmark, exitDirection = null }: CardProps) {
  const t = useT();
  const { locale } = useLocale();
  const bookmarkRef = useRef<HTMLButtonElement | null>(null);

  function handleToggleBookmark(event: any): void {
    event.stopPropagation();
    onToggleBookmark();
    replayAnimation(bookmarkRef.current, 'bookmark-pop');
  }

  const exitClass = exitDirection ? ` card-exit-${exitDirection}` : '';

  return (
    <div className={`flip-card anim-pop-in${exitClass}`} style={exitDirection ? { pointerEvents: 'none' } : undefined}>
      <button
        ref={bookmarkRef}
        className="tap-scale"
        onClick={handleToggleBookmark}
        aria-label={bookmarked ? t.flashcards.bookmarkRemove : t.flashcards.bookmarkAdd}
        style={{
          position: 'absolute',
          top: '0.6rem',
          right: '0.6rem',
          zIndex: 2,
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

      <div className={`flip-card-inner${revealed ? ' is-flipped' : ''}`} onClick={revealed ? undefined : onReveal}>
        <div className="flip-card-face flip-card-front">
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
          <span className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
            {t.flashcards.tapToReveal}
          </span>
        </div>

        <div className="flip-card-face flip-card-back">
          <span className="muted" style={{ fontSize: '0.9rem' }}>
            <span className="hanzi">{item.hanzi}</span> {item.pinyin}
          </span>
          <strong style={{ fontSize: '1.2rem' }}>{pickLocalized(item.meaning, locale)}</strong>
          {item.example ? (
            <div style={{ marginTop: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span className="hanzi">{item.example.sentence}</span>
                <SpeakButton text={item.example.sentence} />
                <CopyButton text={item.example.sentence} />
              </div>
              <div className="muted">{item.example.pinyin}</div>
              <div className="muted">{pickLocalized(item.example.meaning, locale)}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
