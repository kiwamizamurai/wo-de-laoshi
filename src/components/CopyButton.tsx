import { useState } from 'hono/jsx/dom';

interface CopyButtonProps {
  text: string;
}

const FEEDBACK_DURATION_MS = 1200;

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event: any): Promise<void> {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), FEEDBACK_DURATION_MS);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="btn"
      onClick={handleCopy}
      aria-label="コピーする"
      style={{ padding: '0.3em 0.55em', fontSize: '1rem', lineHeight: 1 }}
    >
      <span key={String(copied)} className="anim-pop-in" style={{ display: 'inline-block' }}>
        {copied ? '✓' : '📋'}
      </span>
    </button>
  );
}
