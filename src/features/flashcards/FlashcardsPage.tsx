import { useMemo, useState } from 'hono/jsx/dom';
import phrasesData from '../../data/phrases.json';
import wordsData from '../../data/words.json';
import { CATEGORY_LABELS, type VocabCategory, type VocabItem } from '../../data/types';
import { Card } from './Card';
import { DeckStats } from './DeckStats';
import { ReviewControls } from './ReviewControls';
import { useFlashcards } from './useFlashcards';

const ALL_ITEMS: VocabItem[] = [...(wordsData as VocabItem[]), ...(phrasesData as VocabItem[])];
const CATEGORIES = Array.from(new Set(ALL_ITEMS.map((item) => item.category))) as VocabCategory[];

type Mode = 'srs' | 'bookmarks';

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
            item={current.item}
            revealed={revealed}
            onReveal={revealAnswer}
            bookmarked={bookmarks.has(current.item.id)}
            onToggleBookmark={() => toggleBookmark(current.item.id)}
          />
          {revealed ? <ReviewControls onGrade={grade} /> : null}
        </>
      ) : mode === 'bookmarks' ? (
        <p className="muted">ブックマークしたカードはまだありません。カードの★ボタンでブックマークしましょう。</p>
      ) : (
        <p className="muted">今日学習するカードはありません。お疲れさまでした!</p>
      )}
    </div>
  );
}
