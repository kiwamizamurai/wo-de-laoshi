import { useMemo, useState } from 'hono/jsx/dom';
import { ALL_GRAMMAR_POINTS } from '../../data/grammar';
import { GRAMMAR_CATEGORY_LABELS, type GrammarCategory } from '../../data/types';
import { GrammarListItem } from './GrammarListItem';

const CATEGORIES = Array.from(new Set(ALL_GRAMMAR_POINTS.map((item) => item.category))) as GrammarCategory[];

export function GrammarPage() {
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (selectedCategory === 'all') return ALL_GRAMMAR_POINTS;
    return ALL_GRAMMAR_POINTS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  function toggleExpand(itemId: string): void {
    setExpandedId((prev) => (prev === itemId ? null : itemId));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <select
        value={selectedCategory}
        onChange={(event: any) => setSelectedCategory(event.target.value as GrammarCategory | 'all')}
        className="btn"
      >
        <option value="all">すべてのカテゴリ</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {GRAMMAR_CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>

      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
        {items.length}件の文法ポイント。タップして中国語の説明・例文を確認できます。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((item) => (
          <GrammarListItem
            key={item.id}
            item={item}
            expanded={expandedId === item.id}
            onToggleExpand={() => toggleExpand(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
