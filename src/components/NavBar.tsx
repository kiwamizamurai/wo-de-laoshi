interface NavBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const TABS = [
  { path: '/flashcards', label: '単語帳', icon: '卡' },
  { path: '/search', label: '検索', icon: '找' },
  { path: '/translate', label: '翻訳', icon: '译' },
  { path: '/chat', label: '会話', icon: '话' },
];

function isActive(currentPath: string, tabPath: string): boolean {
  return currentPath === tabPath || currentPath.startsWith(`${tabPath}/`);
}

export function NavBar({ currentPath, onNavigate }: NavBarProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(currentPath, tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => onNavigate(tab.path)}
            style={{
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
            }}
          >
            <span className="hanzi" style={{ fontSize: '1.1rem' }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: '0.75rem' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
