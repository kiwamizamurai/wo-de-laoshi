export interface CardProgress {
  itemId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueDate: string;
  lastReviewed?: string;
}

const STORAGE_KEY = 'wdl:flashcards:v1';

export function loadProgress(): Record<string, CardProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, CardProgress>;
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, CardProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function createInitialProgress(itemId: string): CardProgress {
  return {
    itemId,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueDate: new Date(0).toISOString(),
  };
}
