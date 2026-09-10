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

export function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory | 'all'>('all');

  const items = useMemo(() => {
    if (selectedCategory === 'all') return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const { current, revealed, revealAnswer, grade, stats } = useFlashcards(items);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <select
        value={selectedCategory}
        onChange={(event: any) => setSelectedCategory(event.target.value as VocabCategory | 'all')}
        className="btn"
      >
        <option value="all">すべてのカテゴリ</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>

      <DeckStats stats={stats} />

      {current ? (
        <>
          <Card item={current.item} revealed={revealed} onReveal={revealAnswer} />
          {revealed ? <ReviewControls onGrade={grade} /> : null}
        </>
      ) : (
        <p className="muted">今日学習するカードはありません。お疲れさまでした!</p>
      )}
    </div>
  );
}
