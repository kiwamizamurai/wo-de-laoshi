import { startViewTransition, useEffect, useRef, useState } from 'hono/jsx/dom';
import { prefersReducedMotion } from '../lib/motion';

function readHash(): string {
  const hash = globalThis.location.hash.replace(/^#/, '');
  return hash || '/home';
}

export function useHashRoute(): [string, (path: string) => void] {
  const [path, setPath] = useState(readHash());
  // Tracks the hash `navigate()` last applied, so the async `hashchange` event it
  // triggers doesn't start a second, colliding view transition for the same change.
  const lastAppliedRef = useRef(readHash());

  useEffect(() => {
    const onHashChange = () => {
      const next = readHash();
      if (next === lastAppliedRef.current) return;
      lastAppliedRef.current = next;
      if (prefersReducedMotion()) {
        setPath(next);
      } else {
        startViewTransition(() => setPath(next));
      }
    };
    globalThis.addEventListener('hashchange', onHashChange);
    return () => globalThis.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: string) => {
    lastAppliedRef.current = next;
    const apply = () => {
      globalThis.location.hash = next;
      setPath(next);
    };
    if (prefersReducedMotion()) {
      apply();
    } else {
      startViewTransition(apply);
    }
  };

  return [path, navigate];
}
