import { useMemo } from 'hono/jsx/dom';
import { loadActivityLog, toDateKey } from '../flashcards/activityLog';

const WEEKS = 12;

const LEVEL_COLORS = ['var(--color-surface-alt)', '#f4c7c3', '#e8897d', '#d35d4d', '#c0392b'];

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

interface DayCell {
  key: string;
  label: string;
  count: number;
  inRange: boolean;
}

export function ActivityHeatmap() {
  const { weeks, activeDays, rangeDays } = useMemo(() => {
    const log = loadActivityLog();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rangeStart = new Date(today);
    rangeStart.setDate(rangeStart.getDate() - (WEEKS * 7 - 1));

    const gridStart = new Date(rangeStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    const days: DayCell[] = [];
    const cursor = new Date(gridStart);
    while (cursor <= today) {
      const inRange = cursor >= rangeStart;
      days.push({
        key: toDateKey(cursor),
        label: cursor.toLocaleDateString('ja-JP'),
        count: inRange ? (log[toDateKey(cursor)] ?? 0) : 0,
        inRange,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    while (days.length % 7 !== 0) {
      const last = new Date(days[days.length - 1].key);
      last.setDate(last.getDate() + 1);
      days.push({ key: toDateKey(last), label: last.toLocaleDateString('ja-JP'), count: 0, inRange: false });
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const inRangeDays = days.filter((d) => d.inRange);
    const activeDays = inRangeDays.filter((d) => d.count > 0).length;

    return { weeks, activeDays, rangeDays: inRangeDays.length };
  }, []);

  return (
    <div className="card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong style={{ fontSize: '0.85rem' }}>学習記録</strong>
        <span className="muted" style={{ fontSize: '0.75rem' }}>
          過去{rangeDays}日中{activeDays}日学習
        </span>
      </div>
      <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', padding: '2px' }}>
        {weeks.map((week) => (
          <div key={week[0].key} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {week.map((day) => (
              <div
                key={day.key}
                title={day.inRange ? `${day.label}: ${day.count}件` : undefined}
                style={{
                  width: '11px',
                  height: '11px',
                  borderRadius: '2px',
                  background: day.inRange ? LEVEL_COLORS[levelForCount(day.count)] : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
