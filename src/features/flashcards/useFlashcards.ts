import { useMemo, useState } from 'hono/jsx/dom';
import type { VocabItem } from '../../data/types';
import { loadBookmarks, saveBookmarks } from './bookmarks';
import { createInitialProgress, loadProgress, saveProgress, type CardProgress } from './storage';
import { isDue, schedule, type Grade } from './srs';

export type CardState =
  | { kind: 'new'; item: VocabItem }
  | { kind: 'due'; item: VocabItem; progress: CardProgress };

export interface DeckStats {
  newCount: number;
  dueCount: number;
  completedCount: number;
}

const NEW_CARDS_PER_SESSION = 10;

export function useFlashcards(items: VocabItem[], bookmarkOnly = false) {
  const [progressMap, setProgressMap] = useState<Record<string, CardProgress>>(() => loadProgress());
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadBookmarks());
  const [revealed, setRevealed] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const queue = useMemo<CardState[]>(() => {
    if (bookmarkOnly) {
      return items
        .filter((item) => bookmarks.has(item.id))
        .map((item): CardState => {
          const progress = progressMap[item.id];
          return progress ? { kind: 'due', item, progress } : { kind: 'new', item };
        });
    }
    const due: CardState[] = [];
    const fresh: CardState[] = [];
    for (const item of items) {
      const progress = progressMap[item.id];
      if (!progress) {
        fresh.push({ kind: 'new', item });
      } else if (isDue(progress)) {
        due.push({ kind: 'due', item, progress });
      }
    }
    return [...due, ...fresh.slice(0, NEW_CARDS_PER_SESSION)];
  }, [items, progressMap, bookmarkOnly, bookmarks]);

  const current = queue[0] ?? null;

  function revealAnswer(): void {
    setRevealed(true);
  }

  function grade(g: Grade): void {
    if (!current) return;
    const baseProgress = current.kind === 'due' ? current.progress : createInitialProgress(current.item.id);
    const next = schedule(baseProgress, g);
    setProgressMap((prev) => {
      const updated = { ...prev, [next.itemId]: next };
      saveProgress(updated);
      return updated;
    });
    setRevealed(false);
    setCompletedCount((c) => c + 1);
  }

  function toggleBookmark(itemId: string): void {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      saveBookmarks(next);
      return next;
    });
  }

  const stats: DeckStats = {
    newCount: queue.filter((c) => c.kind === 'new').length,
    dueCount: queue.filter((c) => c.kind === 'due').length,
    completedCount,
  };

  return { current, revealed, revealAnswer, grade, stats, bookmarks, toggleBookmark };
}
