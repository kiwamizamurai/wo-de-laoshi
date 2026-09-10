import { useMemo, useState } from 'hono/jsx/dom';
import { loadBookmarks, saveBookmarks } from '../flashcards/bookmarks';
import { ALL_VOCAB_ITEMS } from '../../data/vocab';
import scenariosData from '../../data/scenarios.json';
import type { ChatScenario } from '../../data/types';
import { search } from './search';
import { SearchResultRow } from './SearchResultRow';

const SCENARIOS = scenariosData as ChatScenario[];

interface SearchPageProps {
  onSelectScenario: (id: string) => void;
}

export function SearchPage({ onSelectScenario }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadBookmarks());

  const results = useMemo(() => search(ALL_VOCAB_ITEMS, SCENARIOS, query), [query]);

  function toggleBookmark(itemId: string): void {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      saveBookmarks(next);
      return next;
    });
  }

  const trimmedQuery = query.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        value={query}
        onInput={(event: any) => setQuery(event.target.value)}
        placeholder="調べたい場面やフレーズを入力してください（例: タクシー、値段、体調）"
        style={{
          padding: '0.7rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontFamily: 'inherit',
          fontSize: '1rem',
        }}
      />

      {!trimmedQuery ? null : results.vocab.length === 0 && results.scenarios.length === 0 ? (
        <p className="muted">「{trimmedQuery}」に一致する結果が見つかりませんでした。</p>
      ) : (
        <>
          {results.scenarios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>会話シナリオ</strong>
              {results.scenarios.map(({ scenario }) => (
                <button
                  key={scenario.id}
                  className="card"
                  style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', border: 'none' }}
                  onClick={() => onSelectScenario(scenario.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{scenario.title}</strong>
                    <span className="muted" style={{ fontSize: '0.75rem' }}>
                      HSK{scenario.hskLevel}
                    </span>
                  </div>
                  <p className="muted" style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
                    {scenario.descriptionJa}
                  </p>
                </button>
              ))}
            </div>
          ) : null}

          {results.vocab.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>
                単語・フレーズ
                {results.vocabTotalCount > results.vocab.length
                  ? `（${results.vocabTotalCount}件中上位${results.vocab.length}件を表示）`
                  : `（${results.vocabTotalCount}件）`}
              </strong>
              {results.vocab.map(({ item }) => (
                <SearchResultRow
                  key={item.id}
                  item={item}
                  bookmarked={bookmarks.has(item.id)}
                  onToggleBookmark={() => toggleBookmark(item.id)}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
