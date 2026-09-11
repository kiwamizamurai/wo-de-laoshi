import { useState } from 'hono/jsx/dom';
import { useT } from '../../i18n/LocaleContext';
import type { FeedbackState } from './useChatSession';

export function FeedbackPanel({ feedback }: { feedback: FeedbackState }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  if (feedback.status === 'pending') {
    return (
      <span className="muted" style={{ fontSize: '0.75rem' }}>
        {t.chat.grading}
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
        {t.chat.viewFeedback(result.score)}
      </button>
      {open ? (
        <div className="card" style={{ marginTop: '0.3rem', padding: '0.6rem', fontSize: '0.8rem' }}>
          <p className="muted" style={{ margin: 0 }}>
            {t.chat.correctedTextLabel}
            <span className="hanzi">{result.correctedText}</span>
          </p>
          <p style={{ margin: '0.3rem 0 0' }}>{result.explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
