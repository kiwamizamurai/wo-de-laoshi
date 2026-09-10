interface SummaryPanelProps {
  summary: string | null;
  loading: boolean;
}

export function SummaryPanel({ summary, loading }: SummaryPanelProps) {
  if (!loading && !summary) return null;
  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <strong style={{ fontSize: '0.85rem' }}>要約</strong>
      {loading ? (
        <span className="muted">要約を生成しています...</span>
      ) : (
        <p style={{ margin: 0 }}>{summary}</p>
      )}
    </div>
  );
}
