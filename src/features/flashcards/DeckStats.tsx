import type { DeckStats as DeckStatsData } from './useFlashcards';
import { useT } from '../../i18n/LocaleContext';

export function DeckStats({ stats }: { stats: DeckStatsData }) {
  const t = useT();
  return (
    <div className="muted" style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
      <span>
        {t.flashcards.stats.new} {stats.newCount}
      </span>
      <span>
        {t.flashcards.stats.due} {stats.dueCount}
      </span>
      <span>
        {t.flashcards.stats.completed} {stats.completedCount}
      </span>
    </div>
  );
}
