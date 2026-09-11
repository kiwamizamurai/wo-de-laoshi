import { isMobileDevice } from '../lib/device';
import { useT } from '../i18n/LocaleContext';
import type { Dictionary } from '../i18n/types';
import type { AiState } from './useAiAvailability';

interface AiStateViewProps<T> {
  state: AiState<T>;
  onRetry: () => void;
  featureLabel: string;
  unsupportedMessage?: string;
  unavailableMessage?: string;
  children: (instance: T) => JSX.Element;
}

function defaultUnsupportedMessage(t: Dictionary): string {
  return isMobileDevice() ? t.ai.unsupportedBodyMobile : t.ai.unsupportedBodyDesktop;
}

function ProgressBar({ ratio }: { ratio: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  return (
    <div
      style={{
        height: '8px',
        borderRadius: '999px',
        background: 'var(--color-surface-alt)',
        overflow: 'hidden',
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: 'var(--color-accent)',
          transition: 'width var(--dur-base) var(--ease-decelerate)',
        }}
      />
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="card anim-slide-up-in"
      style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <strong>{title}</strong>
      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
        {body}
      </p>
    </div>
  );
}

/**
 * AiState<T>のすべての分岐を網羅的にレンダリングするゲートコンポーネント。
 * 'ready' のときだけ children(instance) を描画する。
 */
export function AiStateView<T>({
  state,
  onRetry,
  featureLabel,
  unsupportedMessage,
  unavailableMessage,
  children,
}: AiStateViewProps<T>): JSX.Element {
  const t = useT();
  switch (state.status) {
    case 'checking':
      return (
        <p className="muted" style={{ animation: 'pulse-fade 1.4s ease-in-out infinite' }}>
          {t.ai.checking(featureLabel)}
        </p>
      );
    case 'unsupported':
      return (
        <Notice
          title={t.ai.unsupportedTitle(featureLabel)}
          body={unsupportedMessage ?? defaultUnsupportedMessage(t)}
        />
      );
    case 'unavailable':
      return <Notice title={t.ai.unavailableTitle(featureLabel)} body={unavailableMessage ?? t.ai.unavailableBody} />;
    case 'needs-download':
      return (
        <div
          className="card anim-slide-up-in"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        >
          <strong>{t.ai.needsDownloadTitle(featureLabel)}</strong>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {t.ai.needsDownloadBody}
          </span>
          <button className="btn btn-primary" onClick={state.start}>
            {t.ai.downloadStart}
          </button>
        </div>
      );
    case 'downloading':
      return (
        <div
          className="card anim-slide-up-in"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        >
          <strong>{t.ai.downloadingTitle(featureLabel)}</strong>
          <ProgressBar ratio={state.progress} />
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {t.ai.downloadingBody}
          </span>
        </div>
      );
    case 'error':
      return (
        <div
          className="card"
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            animation: 'slide-up-in var(--dur-base) var(--ease-decelerate) both, wiggle 0.4s var(--ease-standard) 0.2s',
          }}
        >
          <strong>{t.ai.errorTitle(featureLabel)}</strong>
          <button className="btn" onClick={onRetry}>
            {t.ai.retry}
          </button>
        </div>
      );
    case 'ready':
      return children(state.instance);
  }
}
