import { CopyButton } from '../../components/CopyButton';
import { SpeakButton } from '../../components/SpeakButton';
import { GRAMMAR_CATEGORY_LABELS, type GrammarPoint } from '../../data/types';

interface GrammarListItemProps {
  item: GrammarPoint;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function GrammarListItem({ item, expanded, onToggleExpand }: GrammarListItemProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div
        onClick={onToggleExpand}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            {item.englishGrammarRef} ・ {GRAMMAR_CATEGORY_LABELS[item.category]}
          </div>
          <strong style={{ fontSize: '1.05rem' }}>{item.title}</strong>
          <div
            className="muted"
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.2rem' }}
          >
            {item.pattern}
          </div>
        </div>
        <span
          className="muted"
          aria-hidden="true"
          style={{
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--dur-fast) var(--ease-standard)',
          }}
        >
          ▾
        </span>
      </div>

      {expanded ? (
        <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--color-border)' }}>
          <p className="muted" style={{ fontSize: '0.9rem', margin: '0 0 0.6rem' }}>
            {item.explanationJa}
          </p>
          {item.examples.map((example, index) => (
            <div
              key={`${example.hanzi}-${index}`}
              style={{
                marginTop: index > 0 ? '0.6rem' : 0,
                paddingTop: index > 0 ? '0.6rem' : 0,
                borderTop: index > 0 ? '1px solid var(--color-border)' : undefined,
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="hanzi">{example.hanzi}</span>
                <SpeakButton text={example.hanzi} />
                <CopyButton text={example.hanzi} />
              </div>
              <div className="muted">{example.pinyin}</div>
              <div className="muted">{example.meaning}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
