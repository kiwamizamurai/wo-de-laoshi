export interface LanguageOption {
  code: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'zh', label: '中国語(簡体字)' },
  { code: 'ja', label: '日本語' },
];

interface LanguagePickerProps {
  sourceLanguage: string;
  targetLanguage: string;
  onChangeSource: (code: string) => void;
  onChangeTarget: (code: string) => void;
  onSwap: () => void;
}

export function LanguagePicker({
  sourceLanguage,
  targetLanguage,
  onChangeSource,
  onChangeTarget,
  onSwap,
}: LanguagePickerProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <select
        className="btn"
        value={sourceLanguage}
        onChange={(event: any) => onChangeSource(event.target.value)}
        style={{ flex: 1 }}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
      <button className="btn" onClick={onSwap} aria-label="言語を入れ替える" style={{ flexShrink: 0 }}>
        ⇄
      </button>
      <select
        className="btn"
        value={targetLanguage}
        onChange={(event: any) => onChangeTarget(event.target.value)}
        style={{ flex: 1 }}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
