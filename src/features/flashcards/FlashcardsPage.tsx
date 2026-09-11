import { useMemo, useState } from 'hono/jsx/dom';
import { ALL_VOCAB_ITEMS } from '../../data/vocab';
import { CATEGORY_LABELS, type VocabCategory } from '../../data/types';
import { celebrateMascot } from '../../lib/mascotEvents';
import { prefersReducedMotion } from '../../lib/motion';
import { Card } from './Card';
import { DeckStats } from './DeckStats';
import { ReviewControls } from './ReviewControls';
import { useFlashcards } from './useFlashcards';
import type { Grade } from './srs';

const ALL_ITEMS = ALL_VOCAB_ITEMS;
const CATEGORIES = Array.from(new Set(ALL_ITEMS.map((item) => item.category))) as VocabCategory[];

type Mode = 'srs' | 'bookmarks';

const EXIT_DURATION_MS = 420;
const FLY_DIRECTION: Record<Grade, 'left' | 'right'> = {
  again: 'left',
  hard: 'left',
  good: 'right',
  easy: 'right',
};

export function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | 'all'>('all');
  const [mode, setMode] = useState<Mode>('srs');

  const items = useMemo(() => {
    if (mode === 'bookmarks') return ALL_ITEMS;
    if (selectedCategory === 'all') return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, mode]);

  const { current, revealed, revealAnswer, grade, stats, bookmarks, toggleBookmark } = useFlashcards(
    items,
    mode === 'bookmarks',
  );

  const [exitGrade, setExitGrade] = useState<Grade | null>(null);
  const isLastCard = stats.newCount + stats.dueCount <= 1;

  function handleGrade(g: Grade): void {
    if (exitGrade) return;
    const wasLastCard = isLastCard;
    if (prefersReducedMotion()) {
      grade(g);
      if (wasLastCard) {
        celebrateMascot('big');
      } else if (g === 'easy') {
        celebrateMascot('small');
      }
      return;
    }
    setExitGrade(g);
    setTimeout(() => {
      grade(g);
      setExitGrade(null);
      if (wasLastCard) {
        celebrateMascot('big');
      } else if (g === 'easy') {
        celebrateMascot('small');
      }
    }, EXIT_DURATION_MS);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <select
          value={selectedCategory}
          onChange={(event: any) => setSelectedCategory(event.target.value as VocabCategory | 'all')}
          className="btn"
          disabled={mode === 'bookmarks'}
          style={{ flex: 1 }}
        >
          <option value="all">すべてのカテゴリ</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={() => setMode((m) => (m === 'bookmarks' ? 'srs' : 'bookmarks'))}
          style={{
            flexShrink: 0,
            color: mode === 'bookmarks' ? 'var(--color-warning)' : 'var(--color-text)',
            fontWeight: mode === 'bookmarks' ? 700 : 600,
          }}
        >
          {mode === 'bookmarks' ? '★ ブックマーク中' : '☆ ブックマーク'}
        </button>
      </div>

      <DeckStats stats={stats} />

      {current ? (
        <>
          <Card
            key={current.item.id}
            item={current.item}
            revealed={revealed}
            onReveal={revealAnswer}
            bookmarked={bookmarks.has(current.item.id)}
            onToggleBookmark={() => toggleBookmark(current.item.id)}
            exitDirection={exitGrade ? FLY_DIRECTION[exitGrade] : null}
          />
          {revealed && !exitGrade ? <ReviewControls onGrade={handleGrade} /> : null}
        </>
      ) : mode === 'bookmarks' ? (
        <p className="muted">ブックマークしたカードはまだありません。カードの★ボタンでブックマークしましょう。</p>
      ) : (
        <p className="muted">今日学習するカードはありません。お疲れさまでした!</p>
      )}
    </div>
  );
}
