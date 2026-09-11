import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import { pickLocalized } from '../../data/localized';
import type { VocabItem } from '../../data/types';
import { useLocale, useT } from '../../i18n/LocaleContext';
import { PinyinKeyboard } from './PinyinKeyboard';
import { TypingProgress } from './TypingProgress';
import { useTypingPractice } from './useTypingPractice';

interface TypingPracticeProps {
  items: VocabItem[];
}

export function TypingPractice({ items }: TypingPracticeProps) {
  const t = useT();
  const { locale } = useLocale();
  const { current, syllables, cursor, nextKey, stats, total, isComplete, handleKeyPress, reset } =
    useTypingPractice(items);

  if (isComplete || !current) {
    return (
      <div
        className="card anim-pop-in"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', padding: '2rem 1.2rem' }}
      >
        <p className="muted">
          {total === 0 ? t.typing.noItems : t.typing.resultSummary(stats.correct, stats.total)}
        </p>
        {total > 0 ? (
          <button className="btn btn-primary" onClick={reset}>
            {t.typing.restart}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="card anim-pop-in"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="hanzi" style={{ fontSize: 'clamp(1.8rem, 9vw, 2.4rem)', fontWeight: 700 }}>
            {current.hanzi}
          </span>
          <SpeakButton text={current.hanzi} />
          <CopyButton text={current.hanzi} />
        </div>
        <span className="muted">{current.pinyin}</span>
        <span className="muted">{pickLocalized(current.meaning, locale)}</span>
      </div>

      <TypingProgress syllables={syllables} syllableIndex={cursor.syllableIndex} keyIndex={cursor.keyIndex} />

      <PinyinKeyboard nextKey={nextKey} onKeyPress={handleKeyPress} />
    </div>
  );
}
