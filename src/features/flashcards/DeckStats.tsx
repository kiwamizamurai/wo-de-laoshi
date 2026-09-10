import type { DeckStats as DeckStatsData } from './useFlashcards';

export function DeckStats({ stats }: { stats: DeckStatsData }) {
  return (
    <div className="muted" style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
      <span>新規 {stats.newCount}</span>
      <span>復習 {stats.dueCount}</span>
      <span>完了 {stats.completedCount}</span>
    </div>
  );
}
