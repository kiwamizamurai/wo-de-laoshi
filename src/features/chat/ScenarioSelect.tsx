import scenariosData from '../../data/scenarios.json';
import type { ChatScenario } from '../../data/types';

const SCENARIOS = scenariosData as ChatScenario[];

export function ScenarioSelect({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        シナリオを選んでAIと中国語で会話練習をしましょう。
      </p>
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.id}
          className="card"
          style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', border: 'none' }}
          onClick={() => onSelect(scenario.id)}
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
  );
}
