import { ActivityHeatmap } from './ActivityHeatmap';

export function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ActivityHeatmap />
    </div>
  );
}
