import { useT } from '../../i18n/LocaleContext';

export interface LanguageOption {
  code: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [{ code: 'zh' }, { code: 'ja' }];

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
  const t = useT();
  const labelFor = (code: string) => (code === 'zh' ? t.translate.languageZh : t.translate.languageJa);
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
            {labelFor(opt.code)}
          </option>
        ))}
      </select>
      <button className="btn" onClick={onSwap} aria-label={t.translate.swapAriaLabel} style={{ flexShrink: 0 }}>
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
            {labelFor(opt.code)}
          </option>
        ))}
      </select>
    </div>
  );
}
