import { createPromptSession, destroySession, promptStructured, promptText } from '../../ai/promptApi';
import type { ProgressHandler } from '../../ai/types';
import type { ChatScenario } from '../../data/types';

export interface FeedbackResult {
  correctedText: string;
  explanationJa: string;
  score: number;
}

const FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    correctedText: { type: 'string' },
    explanationJa: { type: 'string' },
    score: { type: 'integer', minimum: 0, maximum: 5 },
  },
  required: ['correctedText', 'explanationJa', 'score'],
};

const FEEDBACK_SYSTEM_PROMPT =
  'あなたは中国語教師です。学習者の中国語の発話を評価し、必ず指定のJSON形式のみで返答してください。correctedTextには自然な中国語の訂正案、explanationJaには日本語での短い説明、scoreには0〜5の評価を入れてください。';

export interface ChatTurnResult {
  aiReply: string;
  feedback: FeedbackResult | null;
}

/** ロールプレイ用セッションと添削用セッションを分離して管理するクラス。 */
export class ChatSessionManager {
  #roleplaySession: any = null;
  #feedbackSession: any = null;

  async init(scenario: ChatScenario, onProgress?: ProgressHandler): Promise<void> {
    this.#roleplaySession = await createPromptSession({
      systemPrompt: scenario.systemPrompt,
      onProgress,
    });
    this.#feedbackSession = await createPromptSession({
      systemPrompt: FEEDBACK_SYSTEM_PROMPT,
    });
  }

  async sendUserMessage(text: string): Promise<ChatTurnResult> {
    if (!this.#roleplaySession || !this.#feedbackSession) {
      throw new Error('ChatSessionManager is not initialized');
    }
    const [aiReply, feedback] = await Promise.all([
      promptText(this.#roleplaySession, text),
      promptStructured<FeedbackResult>(this.#feedbackSession, text, FEEDBACK_SCHEMA).catch(() => null),
    ]);
    return { aiReply, feedback };
  }

  dispose(): void {
    destroySession(this.#roleplaySession);
    destroySession(this.#feedbackSession);
    this.#roleplaySession = null;
    this.#feedbackSession = null;
  }
}
