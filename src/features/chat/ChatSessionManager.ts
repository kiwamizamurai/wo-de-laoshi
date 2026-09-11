import { createPromptSession, destroySession, promptStructured, promptText } from '../../ai/promptApi';
import type { ProgressHandler } from '../../ai/types';
import { pickLocalized } from '../../data/localized';
import type { ChatScenario } from '../../data/types';
import type { Locale } from '../../i18n/types';

export interface FeedbackResult {
  correctedText: string;
  explanation: string;
  score: number;
}

const FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    correctedText: { type: 'string' },
    explanation: { type: 'string' },
    score: { type: 'integer', minimum: 0, maximum: 5 },
  },
  required: ['correctedText', 'explanation', 'score'],
};

const FEEDBACK_SYSTEM_PROMPT: Record<Locale, string> = {
  ja: 'あなたは中国語教師です。学習者の中国語の発話を評価し、必ず指定のJSON形式のみで返答してください。correctedTextには自然な中国語の訂正案、explanationには日本語での短い説明、scoreには0〜5の評価を入れてください。',
  en: 'You are a Chinese teacher. Evaluate the learner\'s Chinese utterance and respond only in the specified JSON format. correctedText should be a natural Chinese correction, explanation should be a short explanation written in English, and score should be a 0-5 rating.',
};

export interface ChatTurnResult {
  aiReply: string;
  feedback: FeedbackResult | null;
}

/** ロールプレイ用セッションと添削用セッションを分離して管理するクラス。 */
export class ChatSessionManager {
  #roleplaySession: any = null;
  #feedbackSession: any = null;

  async init(scenario: ChatScenario, locale: Locale, onProgress?: ProgressHandler): Promise<void> {
    this.#roleplaySession = await createPromptSession({
      systemPrompt: pickLocalized(scenario.systemPrompt, locale),
      onProgress,
    });
    this.#feedbackSession = await createPromptSession({
      systemPrompt: FEEDBACK_SYSTEM_PROMPT[locale],
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
