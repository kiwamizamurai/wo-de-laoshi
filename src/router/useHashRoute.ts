import { useEffect, useState } from 'hono/jsx/dom';

function readHash(): string {
  const hash = globalThis.location.hash.replace(/^#/, '');
  return hash || '/flashcards';
}

export function useHashRoute(): [string, (path: string) => void] {
  const [path, setPath] = useState(readHash());

  useEffect(() => {
    const onHashChange = () => setPath(readHash());
    globalThis.addEventListener('hashchange', onHashChange);
    return () => globalThis.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: string) => {
    globalThis.location.hash = next;
  };

  return [path, navigate];
}
