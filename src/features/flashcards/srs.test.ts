import { describe, expect, it } from 'vitest';
import { createInitialProgress } from './storage';
import { isDue, schedule } from './srs';

describe('schedule (SM-2)', () => {
  it('連続してgoodを選ぶと間隔が1→6→拡大していく', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    let progress = createInitialProgress('word-001');

    progress = schedule(progress, 'good', base);
    expect(progress.intervalDays).toBe(1);
    expect(progress.repetitions).toBe(1);

    progress = schedule(progress, 'good', base);
    expect(progress.intervalDays).toBe(6);
    expect(progress.repetitions).toBe(2);

    const thirdIntervalBefore = progress.intervalDays;
    progress = schedule(progress, 'good', base);
    expect(progress.intervalDays).toBeGreaterThan(thirdIntervalBefore);
    expect(progress.repetitions).toBe(3);
  });

  it('againを選ぶとrepetitionsが0にリセットされ、翌日に再出題される', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    let progress = createInitialProgress('word-002');
    progress = schedule(progress, 'good', base);
    progress = schedule(progress, 'good', base);

    progress = schedule(progress, 'again', base);
    expect(progress.repetitions).toBe(0);
    expect(progress.intervalDays).toBe(1);
  });

  it('easeFactorは1.3を下回らない', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    let progress = createInitialProgress('word-003');
    for (let i = 0; i < 20; i++) {
      progress = schedule(progress, 'hard', base);
    }
    expect(progress.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe('isDue', () => {
  it('dueDateが過去または現在時刻ならtrueを返す', () => {
    const progress = createInitialProgress('word-004');
    expect(isDue(progress, new Date('2026-01-01T00:00:00.000Z'))).toBe(true);
  });

  it('dueDateが未来ならfalseを返す', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    const progress = schedule(createInitialProgress('word-005'), 'good', base);
    const oneHourLater = new Date(base.getTime() + 60 * 60 * 1000);
    expect(isDue(progress, oneHourLater)).toBe(false);
  });
});
