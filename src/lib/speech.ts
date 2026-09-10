export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): void {
  cachedVoices = window.speechSynthesis.getVoices();
}

if (isSpeechSynthesisSupported()) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (cachedVoices.length === 0) refreshVoices();
  const exact = cachedVoices.find((v) => v.lang === lang);
  if (exact) return exact;
  const prefix = lang.split('-')[0];
  return cachedVoices.find((v) => v.lang.startsWith(prefix)) ?? null;
}

export function speak(text: string, lang = 'zh-CN'): void {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
