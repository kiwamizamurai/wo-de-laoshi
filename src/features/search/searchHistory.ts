const STORAGE_KEY = 'wdl:searchHistory:v1';
const MAX_HISTORY = 10;

export function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function saveSearchHistory(history: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function addSearchHistory(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return loadSearchHistory();
  const next = [trimmed, ...loadSearchHistory().filter((q) => q !== trimmed)].slice(0, MAX_HISTORY);
  saveSearchHistory(next);
  return next;
}

export function removeSearchHistory(query: string): string[] {
  const next = loadSearchHistory().filter((q) => q !== query);
  saveSearchHistory(next);
  return next;
}

export function clearSearchHistory(): string[] {
  saveSearchHistory([]);
  return [];
}
