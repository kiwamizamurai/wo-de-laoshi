import scenariosData from '../../data/scenarios.json';
import { pickLocalized } from '../../data/localized';
import type { ChatScenario } from '../../data/types';
import { useLocale, useT } from '../../i18n/LocaleContext';

const SCENARIOS = scenariosData as ChatScenario[];

export function ScenarioSelect({ onSelect }: { onSelect: (id: string) => void }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        {t.chat.scenarioSelectIntro}
      </p>
      {SCENARIOS.map((scenario, index) => (
        <button
          key={scenario.id}
          className="card anim-slide-up-in"
          style={{
            padding: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            border: 'none',
            animationDelay: `${index * 40}ms`,
          }}
          onClick={() => onSelect(scenario.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{pickLocalized(scenario.title, locale)}</strong>
            <span className="muted" style={{ fontSize: '0.75rem' }}>
              HSK{scenario.hskLevel}
            </span>
          </div>
          <p className="muted" style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
            {pickLocalized(scenario.description, locale)}
          </p>
        </button>
      ))}
    </div>
  );
}
