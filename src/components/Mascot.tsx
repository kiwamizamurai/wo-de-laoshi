import { useEffect, useRef, useState } from 'hono/jsx/dom';
import { celebrateMascot, MASCOT_CELEBRATE_EVENT, type CelebrateIntensity } from '../lib/mascotEvents';

interface Sparkle {
  id: number;
  dir: number;
  delay: number;
  size: number;
}

let sparkleSeq = 0;

function buildSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: sparkleSeq++,
    dir: (i % 8) + 1,
    delay: i * 35 + Math.round(Math.random() * 40),
    size: 5 + Math.round(Math.random() * 5),
  }));
}

interface MascotProps {
  size?: number;
  interactive?: boolean;
}

export function Mascot({ size = 38, interactive = false }: MascotProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onCelebrate(event: Event): void {
      const intensity = (event as CustomEvent<CelebrateIntensity>).detail ?? 'small';
      const big = intensity === 'big';
      setSparkles(buildSparkles(big ? 12 : 6));
      setCelebrating(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => {
          setCelebrating(false);
          setSparkles([]);
        },
        big ? 1400 : 900,
      );
    }
    window.addEventListener(MASCOT_CELEBRATE_EVENT, onCelebrate);
    return () => {
      window.removeEventListener(MASCOT_CELEBRATE_EVENT, onCelebrate);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden={interactive ? undefined : 'true'}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'パンダを撫でる' : undefined}
      onClick={interactive ? () => celebrateMascot('small') : undefined}
      className={interactive ? 'tap-scale' : undefined}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        cursor: interactive ? 'pointer' : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={celebrating ? 'mascot-celebrate' : 'mascot-idle'}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <ellipse className="mascot-ear mascot-ear-left" cx="24" cy="22" rx="14" ry="14" fill="var(--color-text)" />
        <ellipse className="mascot-ear mascot-ear-right" cx="76" cy="22" rx="14" ry="14" fill="var(--color-text)" />
        <circle cx="50" cy="55" r="38" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="3" />
        <ellipse cx="33" cy="55" rx="11" ry="14" fill="var(--color-text)" />
        <ellipse cx="67" cy="55" rx="11" ry="14" fill="var(--color-text)" />
        <ellipse className="mascot-eye" cx="33" cy="57" rx="4.5" ry="5" fill="var(--color-surface)" />
        <ellipse className="mascot-eye" cx="67" cy="57" rx="4.5" ry="5" fill="var(--color-surface)" />
        <ellipse cx="50" cy="68" rx="5" ry="3.5" fill="var(--color-text)" />
        <path
          d="M 39 75 Q 50 83 61 75"
          fill="none"
          stroke="var(--color-text)"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <ellipse cx="20" cy="66" rx="6" ry="3.5" fill="var(--color-primary)" opacity="0.35" />
        <ellipse cx="80" cy="66" rx="6" ry="3.5" fill="var(--color-primary)" opacity="0.35" />
      </svg>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={`mascot-spark spark-dir-${s.dir}`}
          style={{ width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}ms` }}
        />
      ))}
    </div>
  );
}
