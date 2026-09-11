import { isMobileDevice } from '../lib/device';
import type { AiState } from './useAiAvailability';

interface AiStateViewProps<T> {
  state: AiState<T>;
  onRetry: () => void;
  featureLabel: string;
  unsupportedMessage?: string;
  unavailableMessage?: string;
  children: (instance: T) => JSX.Element;
}

function defaultUnsupportedMessage(): string {
  if (isMobileDevice()) {
    return 'スマートフォンのブラウザでは利用できません。Chrome Built-in AIは現時点でPC版Chrome(バージョン138以降)専用の機能です。';
  }
  return 'Chrome(バージョン138以降)でアクセスしてください。Edgeの一部バージョンでも開発者向けプレビューとして利用できます。';
}

const DEFAULT_UNAVAILABLE_MESSAGE =
  '端末のハードウェア要件(空き容量22GB以上、GPU 4GB VRAM以上またはCPU 16GB RAM+4コア以上)を満たしていない可能性があります。chrome://on-device-internals で状態を確認できます。';

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
  switch (state.status) {
    case 'checking':
      return (
        <p className="muted" style={{ animation: 'pulse-fade 1.4s ease-in-out infinite' }}>
          {featureLabel}を確認しています...
        </p>
      );
    case 'unsupported':
      return (
        <Notice
          title={`${featureLabel}はこのブラウザでは使えません`}
          body={unsupportedMessage ?? defaultUnsupportedMessage()}
        />
      );
    case 'unavailable':
      return (
        <Notice title={`${featureLabel}を利用できません`} body={unavailableMessage ?? DEFAULT_UNAVAILABLE_MESSAGE} />
      );
    case 'needs-download':
      return (
        <div
          className="card anim-slide-up-in"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        >
          <strong>{featureLabel}を利用するにはモデルのダウンロードが必要です</strong>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            初回のみダウンロードが発生します。ボタンを押すと開始します。
          </span>
          <button className="btn btn-primary" onClick={state.start}>
            ダウンロードして開始
          </button>
        </div>
      );
    case 'downloading':
      return (
        <div
          className="card anim-slide-up-in"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        >
          <strong>{featureLabel}のモデルを準備しています</strong>
          <ProgressBar ratio={state.progress} />
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            初回のみダウンロードが発生します。しばらくお待ちください。
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
          <strong>{featureLabel}の準備中にエラーが発生しました</strong>
          <button className="btn" onClick={onRetry}>
            再試行する
          </button>
        </div>
      );
    case 'ready':
      return children(state.instance);
  }
}
