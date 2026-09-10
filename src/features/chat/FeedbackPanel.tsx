import { useState } from 'hono/jsx/dom';
import type { FeedbackState } from './useChatSession';

export function FeedbackPanel({ feedback }: { feedback: FeedbackState }) {
  const [open, setOpen] = useState(false);

  if (feedback.status === 'pending') {
    return (
      <span className="muted" style={{ fontSize: '0.75rem' }}>
        添削中...
      </span>
    );
  }
  if (feedback.status === 'unavailable') {
    return null;
  }

  const { result } = feedback;
  return (
    <div style={{ fontSize: '0.8rem' }}>
      <button className="btn" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setOpen((o) => !o)}>
        添削を見る(スコア {result.score}/5)
      </button>
      {open ? (
        <div className="card" style={{ marginTop: '0.3rem', padding: '0.6rem', fontSize: '0.8rem' }}>
          <p className="muted" style={{ margin: 0 }}>
            訂正案: <span className="hanzi">{result.correctedText}</span>
          </p>
          <p style={{ margin: '0.3rem 0 0' }}>{result.explanationJa}</p>
        </div>
      ) : null}
    </div>
  );
}
