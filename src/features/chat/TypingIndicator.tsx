function Dot({ delay }: { delay: string }) {
  return (
    <span
      style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: 'var(--color-text-muted)',
        animation: 'dot-bounce 1s var(--ease-bounce) infinite',
        animationDelay: delay,
      }}
    />
  );
}

export function TypingIndicator() {
  return (
    <div
      className="card anim-bubble-in-left"
      style={{ padding: '0.7rem 1rem', alignSelf: 'flex-start', display: 'flex', gap: '0.3rem' }}
    >
      <Dot delay="0s" />
      <Dot delay="0.15s" />
      <Dot delay="0.3s" />
    </div>
  );
}
