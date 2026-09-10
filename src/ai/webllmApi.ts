import type { MLCEngine } from '@mlc-ai/web-llm';
import { isWebGPUAvailable } from '../lib/device';
import type { AvailabilityState, ProgressHandler } from './types';

const MODEL_ID = 'Qwen3-0.6B-q4f16_1-MLC';

export function isWebLLMSupported(): boolean {
  return typeof (navigator as any).gpu !== 'undefined';
}

export async function getWebLLMAvailability(): Promise<AvailabilityState> {
  if (!isWebLLMSupported()) return 'unavailable';
  const ok = await isWebGPUAvailable();
  return ok ? 'downloadable' : 'unavailable';
}

export async function createWebLLMEngine(onProgress?: ProgressHandler): Promise<MLCEngine> {
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
  return CreateMLCEngine(MODEL_ID, {
    initProgressCallback: (report) => {
      onProgress?.(report.progress);
    },
  });
}

let sharedEnginePromise: Promise<MLCEngine> | null = null;

export function getSharedWebLLMEngine(onProgress?: ProgressHandler): Promise<MLCEngine> {
  if (!sharedEnginePromise) {
    const created = createWebLLMEngine(onProgress).catch((error) => {
      if (sharedEnginePromise === created) sharedEnginePromise = null;
      throw error;
    });
    sharedEnginePromise = created;
  }
  return sharedEnginePromise;
}

function stripThinkBlock(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

export async function webllmChatComplete(engine: MLCEngine, systemPrompt: string, userText: string): Promise<string> {
  const reply = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText },
    ],
    extra_body: { enable_thinking: false },
  });
  const content = reply.choices[0]?.message?.content ?? '';
  return stripThinkBlock(content);
}

export function destroyWebLLMEngine(engine: MLCEngine): void {
  void engine?.unload?.();
}
