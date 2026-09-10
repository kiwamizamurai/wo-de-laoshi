import type { CardProgress } from './storage';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const QUALITY_BY_GRADE: Record<Grade, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

/** SM-2アルゴリズムによる次回復習日の計算。 */
export function schedule(progress: CardProgress, grade: Grade, today: Date = new Date()): CardProgress {
  const quality = QUALITY_BY_GRADE[grade];
  let { easeFactor, intervalDays, repetitions } = progress;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(intervalDays * easeFactor);
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }

  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + intervalDays);

  return {
    ...progress,
    easeFactor,
    intervalDays,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReviewed: today.toISOString(),
  };
}

export function isDue(progress: CardProgress, today: Date = new Date()): boolean {
  return new Date(progress.dueDate).getTime() <= today.getTime();
}
