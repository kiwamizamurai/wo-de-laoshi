import { speak } from '../lib/speech';

interface SpeakButtonProps {
  text: string;
  lang?: string;
}

export function SpeakButton({ text, lang }: SpeakButtonProps) {
  return (
    <button
      className="btn"
      onClick={(event: any) => {
        event.stopPropagation();
        speak(text, lang);
      }}
      aria-label="発音を聞く"
      style={{ padding: '0.3em 0.55em', fontSize: '1rem', lineHeight: 1 }}
    >
      🔊
    </button>
  );
}
