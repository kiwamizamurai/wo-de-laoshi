import { useState } from 'hono/jsx/dom';

interface NavBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface TabSpec {
  path: string;
  label: string;
  icon: string;
}

const TABS: TabSpec[] = [
  { path: '/home', label: 'ホーム', icon: '家' },
  { path: '/flashcards', label: '単語帳', icon: '卡' },
  { path: '/search', label: '検索', icon: '找' },
  { path: '/translate', label: '翻訳', icon: '译' },
  { path: '/chat', label: '会話', icon: '话' },
];

function isActive(currentPath: string, tabPath: string): boolean {
  return currentPath === tabPath || currentPath.startsWith(`${tabPath}/`);
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

let rippleSeq = 0;

interface NavTabButtonProps {
  tab: TabSpec;
  active: boolean;
  onNavigate: (path: string) => void;
}

function NavTabButton({ tab, active, onNavigate }: NavTabButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleClick(event: any): void {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.7;
    setRipples((prev) => [
      ...prev,
      { id: rippleSeq++, x: event.clientX - rect.left, y: event.clientY - rect.top, size },
    ]);
    onNavigate(tab.path);
  }

  function removeRipple(id: number): void {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <button
      className="tap-scale nav-tab"
      onClick={handleClick}
      style={{
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.15rem',
        padding: '0.6rem 0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
        fontWeight: active ? 700 : 500,
        transition: 'color var(--dur-fast) var(--ease-standard)',
      }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="nav-ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px`, width: `${r.size}px`, height: `${r.size}px` }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span
        className="hanzi"
        style={{
          fontSize: '1.1rem',
          display: 'inline-block',
          transform: active ? 'scale(1.2) translateY(-1px)' : 'scale(1)',
          transition: 'transform var(--dur-base) var(--ease-bounce)',
        }}
      >
        {tab.icon}
      </span>
      <span style={{ fontSize: '0.75rem' }}>{tab.label}</span>
    </button>
  );
}

export function NavBar({ currentPath, onNavigate }: NavBarProps) {
  const activeIndex = TABS.findIndex((tab) => isActive(currentPath, tab.path));

  return (
    <nav
      className="app-intro-navbar"
      style={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '0.35rem',
          left: 0,
          width: `${100 / TABS.length}%`,
          height: 'calc(100% - 0.7rem)',
          transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          transition: 'transform var(--dur-base) var(--ease-bounce)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            width: '72%',
            height: '100%',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </div>
      {TABS.map((tab) => (
        <NavTabButton key={tab.path} tab={tab} active={isActive(currentPath, tab.path)} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
