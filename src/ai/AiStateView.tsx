import type { AiState } from './useAiAvailability';

interface AiStateViewProps<T> {
  state: AiState<T>;
  onRetry: () => void;
  featureLabel: string;
  children: (instance: T) => JSX.Element;
}

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function unsupportedMessage(): string {
  if (isMobileDevice()) {
    return 'スマートフォンのブラウザでは利用できません。Chrome Built-in AIは現時点でPC版Chrome(バージョン138以降)専用の機能です。';
  }
  return 'Chrome(バージョン138以降)でアクセスしてください。Edgeの一部バージョンでも開発者向けプレビューとして利用できます。';
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
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--color-accent)',
          transition: 'width 0.2s ease',
        }}
      />
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
export function AiStateView<T>({ state, onRetry, featureLabel, children }: AiStateViewProps<T>): JSX.Element {
  switch (state.status) {
    case 'checking':
      return <p className="muted">{featureLabel}を確認しています...</p>;
    case 'unsupported':
      return (
        <Notice title={`${featureLabel}はこのブラウザでは使えません`} body={unsupportedMessage()} />
      );
    case 'unavailable':
      return (
        <Notice
          title={`${featureLabel}を利用できません`}
          body="端末のハードウェア要件(空き容量22GB以上、GPU 4GB VRAM以上またはCPU 16GB RAM+4コア以上)を満たしていない可能性があります。chrome://on-device-internals で状態を確認できます。"
        />
      );
    case 'downloading':
      return (
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <strong>{featureLabel}のモデルを準備しています</strong>
          <ProgressBar ratio={state.progress} />
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            初回のみダウンロードが発生します。しばらくお待ちください。
          </span>
        </div>
      );
    case 'error':
      return (
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
