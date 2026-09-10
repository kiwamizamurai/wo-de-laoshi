import type { ChatTurn } from './useChatSession';
import { FeedbackPanel } from './FeedbackPanel';

export function ChatMessage({ turn }: { turn: ChatTurn }) {
  if (turn.role === 'ai') {
    return (
      <div className="card" style={{ padding: '0.8rem 1rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
        {turn.reply.kind === 'structured' ? (
          <>
            <p className="hanzi" style={{ margin: 0, fontSize: '1.05rem' }}>
              {turn.reply.hanzi}
            </p>
            <p className="muted" style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>
              {turn.reply.pinyin}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{turn.reply.meaningJa}</p>
          </>
        ) : (
          <p style={{ margin: 0 }}>{turn.reply.text}</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div
        className="card"
        style={{ padding: '0.8rem 1rem', background: 'var(--color-primary)', color: 'var(--color-primary-contrast)' }}
      >
        <p className="hanzi" style={{ margin: 0 }}>
          {turn.text}
        </p>
      </div>
      <FeedbackPanel feedback={turn.feedback} />
    </div>
  );
}
