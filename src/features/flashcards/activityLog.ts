const STORAGE_KEY = 'wdl:activity:v1';

export type ActivityLog = Record<string, number>;

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadActivityLog(): ActivityLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ActivityLog;
  } catch {
    return {};
  }
}

export function recordActivity(date: Date = new Date()): ActivityLog {
  const log = loadActivityLog();
  const key = toDateKey(date);
  log[key] = (log[key] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  return log;
}

export { toDateKey };
