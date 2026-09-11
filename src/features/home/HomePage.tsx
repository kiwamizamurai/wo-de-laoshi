import { useMemo } from 'hono/jsx/dom';
import { Mascot } from '../../components/Mascot';
import { loadActivityLog, toDateKey } from '../flashcards/activityLog';
import { ActivityHeatmap } from './ActivityHeatmap';
import { timeGreeting } from './greeting';

export function HomePage() {
  const { greeting, todayCount } = useMemo(() => {
    const now = new Date();
    const log = loadActivityLog();
    return {
      greeting: timeGreeting(now.getHours()),
      todayCount: log[toDateKey(now)] ?? 0,
    };
  }, []);

  const subtext = todayCount > 0 ? `今日はもう${todayCount}件学習したよ、えらい!` : '今日も一緒に少しずつ頑張ろう';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        className="card anim-pop-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '2.2rem 1rem',
          textAlign: 'center',
        }}
      >
        <Mascot size={120} interactive />
        <strong style={{ fontSize: '1.1rem' }}>{greeting}!</strong>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          {subtext}
        </span>
      </div>
      <ActivityHeatmap />
    </div>
  );
}
