import { NavBar } from './NavBar';

interface LayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: JSX.Element | JSX.Element[] | string | false | null;
}

export function Layout({ currentPath, onNavigate, children }: LayoutProps) {
  return (
    <>
      <header
        style={{
          padding: '1rem 1rem 0.5rem',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.5rem',
        }}
      >
        <span className="hanzi" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          我的老师
        </span>
        <span className="muted" style={{ fontSize: '0.8rem' }}>
          中国語学習
        </span>
      </header>
      <main className="page">{children}</main>
      <NavBar currentPath={currentPath} onNavigate={onNavigate} />
    </>
  );
}
