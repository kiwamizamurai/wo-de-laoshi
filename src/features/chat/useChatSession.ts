import { useEffect, useState } from 'hono/jsx/dom';
import { pickLocalized } from '../../data/localized';
import type { ChatScenario } from '../../data/types';
import { useLocale } from '../../i18n/LocaleContext';
import type { ChatSessionManager, FeedbackResult } from './ChatSessionManager';
import { parseAiReply, type ParsedAiReply } from './parseAiReply';

export type FeedbackState =
  | { status: 'pending' }
  | { status: 'ready'; result: FeedbackResult }
  | { status: 'unavailable' };

export type ChatTurn =
  | { role: 'ai'; reply: ParsedAiReply }
  | { role: 'user'; text: string; feedback: FeedbackState };

const MAX_TURNS = 10;

export function useChatSession(scenario: ChatScenario, manager: ChatSessionManager) {
  const { locale } = useLocale();
  const [turns, setTurns] = useState<ChatTurn[]>(() => [
    { role: 'ai', reply: parseAiReply(pickLocalized(scenario.starterMessage, locale)) },
  ]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setTurns([{ role: 'ai', reply: parseAiReply(pickLocalized(scenario.starterMessage, locale)) }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const turnCount = turns.filter((turn) => turn.role === 'user').length;
  const reachedLimit = turnCount >= MAX_TURNS;

  async function sendMessage(text: string): Promise<void> {
    if (sending || reachedLimit) return;

    setSending(true);
    setTurns((prev) => [...prev, { role: 'user', text, feedback: { status: 'pending' } }]);

    try {
      const { aiReply, feedback } = await manager.sendUserMessage(text);
      setTurns((prev) => {
        const next = [...prev];
        const lastUserIndex = next.map((turn) => turn.role).lastIndexOf('user');
        if (lastUserIndex !== -1) {
          next[lastUserIndex] = {
            role: 'user',
            text,
            feedback: feedback ? { status: 'ready', result: feedback } : { status: 'unavailable' },
          };
        }
        next.push({ role: 'ai', reply: parseAiReply(aiReply) });
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  return { turns, sending, reachedLimit, turnCount, maxTurns: MAX_TURNS, sendMessage };
}
