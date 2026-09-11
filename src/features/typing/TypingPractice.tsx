import type { VocabItem } from '../../data/types';
import { PinyinKeyboard } from './PinyinKeyboard';
import { TypingProgress } from './TypingProgress';
import { useTypingPractice } from './useTypingPractice';

interface TypingPracticeProps {
  items: VocabItem[];
}

export function TypingPractice({ items }: TypingPracticeProps) {
  const { current, syllables, cursor, nextKey, stats, total, isComplete, handleKeyPress, reset } =
    useTypingPractice(items);

  if (isComplete || !current) {
    return (
      <div
        className="card anim-pop-in"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', padding: '2rem 1.2rem' }}
      >
        <p className="muted">
          {total === 0
            ? 'タイピング練習できる単語がありません。'
            : `お疲れさまでした! ${stats.correct}/${stats.total} 問正解しました。`}
        </p>
        {total > 0 ? (
          <button className="btn btn-primary" onClick={reset}>
            もう一度
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
        <span className="hanzi" style={{ fontSize: 'clamp(1.8rem, 9vw, 2.4rem)', fontWeight: 700 }}>
          {current.hanzi}
        </span>
        <span className="muted">{current.pinyin}</span>
        <span className="muted">{current.meaning}</span>
      </div>

      <TypingProgress syllables={syllables} syllableIndex={cursor.syllableIndex} keyIndex={cursor.keyIndex} />

      <PinyinKeyboard nextKey={nextKey} onKeyPress={handleKeyPress} />
    </div>
  );
}
