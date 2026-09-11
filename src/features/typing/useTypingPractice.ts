import { useMemo, useState } from 'hono/jsx/dom';
import { recordActivity } from '../flashcards/activityLog';
import { isDue } from '../flashcards/srs';
import { loadProgress } from '../flashcards/storage';
import { celebrateMascot } from '../../lib/mascotEvents';
import type { PinyinKey, VocabItem } from '../../data/types';

interface Cursor {
  syllableIndex: number;
  keyIndex: number;
}

export interface TypingStats {
  correct: number;
  total: number;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildQueue(items: VocabItem[]): VocabItem[] {
  const progressMap = loadProgress();
  const due: VocabItem[] = [];
  const fresh: VocabItem[] = [];
  for (const item of items) {
    const progress = progressMap[item.id];
    if (progress && isDue(progress)) {
      due.push(item);
    } else if (!progress) {
      fresh.push(item);
    }
  }
  return [...shuffle(due), ...shuffle(fresh)];
}

export function useTypingPractice(items: VocabItem[]) {
  const typable = useMemo(() => items.filter((item) => item.typing.length > 0), [items]);
  const queue = useMemo(() => buildQueue(typable), [typable]);

  const [index, setIndex] = useState(0);
  const [cursor, setCursor] = useState<Cursor>({ syllableIndex: 0, keyIndex: 0 });
  const [mistakes, setMistakes] = useState(0);
  const [stats, setStats] = useState<TypingStats>({ correct: 0, total: 0 });

  const current = queue[index] ?? null;
  const syllables = current?.typing ?? [];
  const nextKey: PinyinKey | null = syllables[cursor.syllableIndex]?.[cursor.keyIndex] ?? null;

  function handleBackspace(): void {
    setCursor((prev) => {
      if (prev.keyIndex > 0) return { syllableIndex: prev.syllableIndex, keyIndex: prev.keyIndex - 1 };
      if (prev.syllableIndex > 0) {
        const prevSyllable = syllables[prev.syllableIndex - 1];
        return { syllableIndex: prev.syllableIndex - 1, keyIndex: prevSyllable.length - 1 };
      }
      return prev;
    });
  }

  function handleKeyPress(button: string): void {
    if (!current) return;
    if (button === '{bksp}') {
      handleBackspace();
      return;
    }
    if (button !== nextKey) {
      setMistakes((m) => m + 1);
      return;
    }

    const syllable = syllables[cursor.syllableIndex];
    if (cursor.keyIndex + 1 < syllable.length) {
      setCursor({ syllableIndex: cursor.syllableIndex, keyIndex: cursor.keyIndex + 1 });
      return;
    }
    if (cursor.syllableIndex + 1 < syllables.length) {
      celebrateMascot('small');
      setCursor({ syllableIndex: cursor.syllableIndex + 1, keyIndex: 0 });
      return;
    }

    recordActivity();
    const isLastItem = index + 1 >= queue.length;
    setStats((s) => ({ correct: s.correct + (mistakes === 0 ? 1 : 0), total: s.total + 1 }));
    celebrateMascot(isLastItem ? 'big' : 'small');
    setIndex((i) => i + 1);
    setCursor({ syllableIndex: 0, keyIndex: 0 });
    setMistakes(0);
  }

  function reset(): void {
    setIndex(0);
    setCursor({ syllableIndex: 0, keyIndex: 0 });
    setMistakes(0);
    setStats({ correct: 0, total: 0 });
  }

  return {
    current,
    syllables,
    cursor,
    nextKey,
    stats,
    total: queue.length,
    isComplete: index >= queue.length,
    handleKeyPress,
    reset,
  };
}
