import type { AvailabilityState, ProgressHandler } from './types';

function getLanguageModel(): any {
  return (globalThis as any).LanguageModel;
}

export function isPromptApiSupported(): boolean {
  return typeof getLanguageModel() !== 'undefined';
}

export async function getPromptAvailability(): Promise<AvailabilityState> {
  if (!isPromptApiSupported()) return 'unavailable';
  try {
    return await getLanguageModel().availability();
  } catch {
    return 'unavailable';
  }
}

export interface CreateSessionOptions {
  systemPrompt: string;
  onProgress?: ProgressHandler;
}

export async function createPromptSession(opts: CreateSessionOptions): Promise<any> {
  const LanguageModel = getLanguageModel();
  return LanguageModel.create({
    initialPrompts: [{ role: 'system', content: opts.systemPrompt }],
    monitor(monitorTarget: EventTarget) {
      monitorTarget.addEventListener('downloadprogress', (event: any) => {
        opts.onProgress?.(event.loaded ?? 0);
      });
    },
  });
}

export async function promptText(session: any, text: string): Promise<string> {
  return session.prompt(text);
}

export async function promptStructured<T>(session: any, text: string, schema: object): Promise<T> {
  const raw = await session.prompt(text, { responseConstraint: schema });
  return JSON.parse(raw) as T;
}

export function destroySession(session: any): void {
  session?.destroy?.();
}
