import type { AvailabilityState } from './types';

function getLanguageDetector(): any {
  return (globalThis as any).LanguageDetector;
}

export function isLanguageDetectorApiSupported(): boolean {
  return typeof getLanguageDetector() !== 'undefined';
}

export async function getLanguageDetectorAvailability(): Promise<AvailabilityState> {
  if (!isLanguageDetectorApiSupported()) return 'unavailable';
  try {
    return await getLanguageDetector().availability();
  } catch {
    return 'unavailable';
  }
}

export async function createLanguageDetector(): Promise<any> {
  return getLanguageDetector().create();
}

export interface DetectedLanguage {
  detectedLanguage: string;
  confidence: number;
}

export async function detectLanguage(detector: any, text: string): Promise<DetectedLanguage[]> {
  return detector.detect(text);
}
