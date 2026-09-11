import type { PinyinKey } from '../../data/types';

interface TypingProgressProps {
  syllables: PinyinKey[][];
  syllableIndex: number;
  keyIndex: number;
}

export function TypingProgress({ syllables, syllableIndex, keyIndex }: TypingProgressProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: '1.3rem',
        fontWeight: 700,
      }}
    >
      {syllables.map((syllable, i) => {
        const roman = syllable.join('');
        const color =
          i < syllableIndex
            ? 'var(--color-accent)'
            : i === syllableIndex
              ? 'var(--color-primary)'
              : 'var(--color-text-muted)';
        return (
          <span key={i} style={{ color }}>
            {i === syllableIndex ? (
              <>
                <span style={{ opacity: 0.4 }}>{roman.slice(0, keyIndex)}</span>
                {roman.slice(keyIndex)}
              </>
            ) : (
              roman
            )}
          </span>
        );
      })}
    </div>
  );
}
