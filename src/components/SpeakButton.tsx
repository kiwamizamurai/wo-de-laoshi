import { speak } from '../lib/speech';
import { useT } from '../i18n/LocaleContext';

interface SpeakButtonProps {
  text: string;
  lang?: string;
}

export function SpeakButton({ text, lang }: SpeakButtonProps) {
  const t = useT();
  return (
    <button
      className="btn"
      onClick={(event: any) => {
        event.stopPropagation();
        speak(text, lang);
      }}
      aria-label={t.common.speak}
      style={{ padding: '0.3em 0.55em', fontSize: '1rem', lineHeight: 1 }}
    >
      🔊
    </button>
  );
}
