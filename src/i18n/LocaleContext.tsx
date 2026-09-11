import { createContext, useContext, useEffect, useState } from 'hono/jsx/dom';
import type { Dictionary, Locale } from './types';
import { DICTIONARIES } from './dictionary';
import { resolveInitialLocale } from './resolveInitialLocale';
import { saveStoredLocale } from './storage';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children?: JSX.Element | JSX.Element[] | string | false | null;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale): void {
    saveStoredLocale(next);
    setLocaleState(next);
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

export function useT(): Dictionary {
  const { locale } = useLocale();
  return DICTIONARIES[locale];
}
