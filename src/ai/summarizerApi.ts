import type { AvailabilityState, ProgressHandler } from './types';

function getSummarizer(): any {
  return (globalThis as any).Summarizer;
}

export function isSummarizerApiSupported(): boolean {
  return typeof getSummarizer() !== 'undefined';
}

export async function getSummarizerAvailability(): Promise<AvailabilityState> {
  if (!isSummarizerApiSupported()) return 'unavailable';
  try {
    return await getSummarizer().availability();
  } catch {
    return 'unavailable';
  }
}

export async function createSummarizer(onProgress?: ProgressHandler): Promise<any> {
  const Summarizer = getSummarizer();
  return Summarizer.create({
    type: 'key-points',
    format: 'plain-text',
    length: 'short',
    outputLanguage: 'ja',
    monitor(monitorTarget: EventTarget) {
      monitorTarget.addEventListener('downloadprogress', (event: any) => {
        onProgress?.(event.loaded ?? 0);
      });
    },
  });
}

export async function summarizeText(summarizer: any, text: string): Promise<string> {
  return summarizer.summarize(text);
}
