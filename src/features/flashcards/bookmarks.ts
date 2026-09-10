const STORAGE_KEY = 'wdl:bookmarks:v1';

export function loadBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveBookmarks(bookmarks: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
}
