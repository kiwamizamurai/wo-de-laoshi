import type { Grade } from './srs';
import { useT } from '../../i18n/LocaleContext';

interface ReviewControlsProps {
  onGrade: (grade: Grade) => void;
}

interface GradeButtonSpec {
  grade: Grade;
  color: string;
}

const GRADE_BUTTONS: GradeButtonSpec[] = [
  { grade: 'again', color: 'var(--color-danger)' },
  { grade: 'hard', color: 'var(--color-warning)' },
  { grade: 'good', color: 'var(--color-accent)' },
  { grade: 'easy', color: 'var(--color-primary)' },
];

export function ReviewControls({ onGrade }: ReviewControlsProps) {
  const t = useT();
  return (
    <div className="review-controls">
      {GRADE_BUTTONS.map(({ grade, color }) => (
        <button
          key={grade}
          className="btn"
          style={{ color, border: `1px solid ${color}`, minWidth: 'max-content', whiteSpace: 'nowrap' }}
          onClick={() => onGrade(grade)}
        >
          {t.flashcards.grade[grade]}
        </button>
      ))}
    </div>
  );
}
