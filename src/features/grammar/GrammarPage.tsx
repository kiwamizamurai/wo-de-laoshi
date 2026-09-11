import { useMemo, useState } from 'hono/jsx/dom';
import { ALL_GRAMMAR_POINTS } from '../../data/grammar';
import type { GrammarCategory } from '../../data/types';
import { useT } from '../../i18n/LocaleContext';
import { GrammarListItem } from './GrammarListItem';

const CATEGORIES = Array.from(new Set(ALL_GRAMMAR_POINTS.map((item) => item.category))) as GrammarCategory[];

export function GrammarPage() {
  const t = useT();
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
        <option value="all">{t.categories.all}</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {t.categories.grammar[cat]}
          </option>
        ))}
      </select>

      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>
        {t.grammar.pointCount(items.length)}
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
