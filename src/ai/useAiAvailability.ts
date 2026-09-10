import { useEffect, useRef, useState } from 'hono/jsx/dom';
import type { ProgressHandler } from './types';

export type AiState<T> =
  | { status: 'checking' }
  | { status: 'unsupported' }
  | { status: 'unavailable' }
  | { status: 'needs-download'; start: () => void }
  | { status: 'downloading'; progress: number }
  | { status: 'ready'; instance: T }
  | { status: 'error'; error: unknown };

export interface UseAiAvailabilityOptions<T> {
  isSupported: () => boolean;
  checkAvailability: () => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
  createInstance: (onProgress: ProgressHandler) => Promise<T>;
  disposeInstance?: (instance: T) => void;
}

export interface UseAiAvailabilityResult<T> {
  state: AiState<T>;
  retry: () => void;
}

export function useAiAvailability<T>(
  opts: UseAiAvailabilityOptions<T>,
  deps: unknown[],
): UseAiAvailabilityResult<T> {
  const [state, setState] = useState<AiState<T>>({ status: 'checking' });
  const [retryCount, setRetryCount] = useState(0);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    let cancelled = false;
    let createdInstance: T | null = null;
    setState({ status: 'checking' });

    async function startCreate() {
      if (!cancelled) setState({ status: 'downloading', progress: 0 });
      try {
        const instance = await optsRef.current.createInstance((progress) => {
          if (!cancelled) setState({ status: 'downloading', progress });
        });
        createdInstance = instance;
        if (cancelled) {
          optsRef.current.disposeInstance?.(instance);
          return;
        }
        setState({ status: 'ready', instance });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', error });
      }
    }

    async function run() {
      const { isSupported, checkAvailability } = optsRef.current;
      if (!isSupported()) {
        if (!cancelled) setState({ status: 'unsupported' });
        return;
      }
      try {
        const availability = await checkAvailability();
        if (availability === 'unavailable') {
          if (!cancelled) setState({ status: 'unavailable' });
          return;
        }
        if (availability === 'available') {
          await startCreate();
          return;
        }
        // 'downloadable' | 'downloading': Chrome側の仕様でモデル取得の開始にはユーザー操作が必要
        if (!cancelled) {
          setState({
            status: 'needs-download',
            start: () => {
              void startCreate();
            },
          });
        }
      } catch (error) {
        if (!cancelled) setState({ status: 'error', error });
      }
    }

    void run();
    return () => {
      cancelled = true;
      if (createdInstance) optsRef.current.disposeInstance?.(createdInstance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryCount]);

  return {
    state,
    retry: () => setRetryCount((c) => c + 1),
  };
}
