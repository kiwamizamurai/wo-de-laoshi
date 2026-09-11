import { useLocale } from '../i18n/LocaleContext';
import type { Locale } from '../i18n/types';

const LOCALES: Locale[] = ['ja', 'en'];

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
      {LOCALES.map((code) => (
        <button
          key={code}
          className="tap-scale"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          style={{
            padding: '0.15rem 0.4rem',
            fontSize: '0.7rem',
            fontWeight: locale === code ? 700 : 500,
            color: locale === code ? 'var(--color-primary)' : 'var(--color-text-muted)',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
