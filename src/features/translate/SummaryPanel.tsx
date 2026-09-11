import { useT } from '../../i18n/LocaleContext';

interface SummaryPanelProps {
  summary: string | null;
  loading: boolean;
}

export function SummaryPanel({ summary, loading }: SummaryPanelProps) {
  const t = useT();
  if (!loading && !summary) return null;
  return (
    <div
      className="card anim-slide-up-in"
      style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
    >
      <strong style={{ fontSize: '0.85rem' }}>{t.translate.summaryTitle}</strong>
      {loading ? <span className="muted">{t.translate.summarizing}</span> : <p style={{ margin: 0 }}>{summary}</p>}
    </div>
  );
}
