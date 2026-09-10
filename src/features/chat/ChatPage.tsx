import { useState } from 'hono/jsx/dom';
import { AiStateView } from '../../ai/AiStateView';
import { getPromptAvailability, isPromptApiSupported } from '../../ai/promptApi';
import { useAiAvailability } from '../../ai/useAiAvailability';
import scenariosData from '../../data/scenarios.json';
import type { ChatScenario } from '../../data/types';
import { ChatSessionManager } from './ChatSessionManager';
import { ChatMessage } from './ChatMessage';
import { useChatSession } from './useChatSession';

const SCENARIOS = scenariosData as ChatScenario[];

interface ChatPageProps {
  scenarioId: string;
  onExit: () => void;
}

export function ChatPage({ scenarioId, onExit }: ChatPageProps) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn" onClick={onExit}>
          ← シナリオ選択
        </button>
        {scenario ? <strong>{scenario.title}</strong> : null}
      </div>
      {scenario ? (
        <ChatPageBody scenario={scenario} />
      ) : (
        <p className="muted">シナリオが見つかりませんでした。</p>
      )}
    </div>
  );
}

function ChatPageBody({ scenario }: { scenario: ChatScenario }) {
  const { state, retry } = useAiAvailability(
    {
      isSupported: isPromptApiSupported,
      checkAvailability: getPromptAvailability,
      createInstance: async (onProgress) => {
        const manager = new ChatSessionManager();
        await manager.init(scenario, onProgress);
        return manager;
      },
      disposeInstance: (manager) => manager.dispose(),
    },
    [scenario.id],
  );

  return (
    <AiStateView state={state} onRetry={retry} featureLabel="AI会話練習">
      {(manager) => <ChatConversation scenario={scenario} manager={manager} />}
    </AiStateView>
  );
}

function ChatConversation({ scenario, manager }: { scenario: ChatScenario; manager: ChatSessionManager }) {
  const [input, setInput] = useState('');
  const { turns, sending, reachedLimit, turnCount, maxTurns, sendMessage } = useChatSession(scenario, manager);

  function handleSend(): void {
    const text = input.trim();
    if (!text) return;
    setInput('');
    void sendMessage(text);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {turns.map((turn, i) => (
          <ChatMessage key={i} turn={turn} />
        ))}
      </div>
      {reachedLimit ? (
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          このシナリオは会話上限({maxTurns}往復)に達しました。シナリオを選び直してください。
        </p>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onInput={(event: any) => setInput(event.target.value)}
            onKeyDown={(event: any) => {
              if (event.key === 'Enter') handleSend();
            }}
            placeholder="中国語で入力..."
            disabled={sending}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
            送信
          </button>
        </div>
      )}
      <span className="muted" style={{ fontSize: '0.75rem' }}>
        {turnCount}/{maxTurns} 往復
      </span>
    </>
  );
}
