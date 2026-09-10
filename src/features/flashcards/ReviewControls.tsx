import type { Grade } from './srs';

interface ReviewControlsProps {
  onGrade: (grade: Grade) => void;
}

interface GradeButtonSpec {
  grade: Grade;
  label: string;
  color: string;
}

const GRADE_BUTTONS: GradeButtonSpec[] = [
  { grade: 'again', label: 'もう一度', color: 'var(--color-danger)' },
  { grade: 'hard', label: '難しい', color: 'var(--color-warning)' },
  { grade: 'good', label: '普通', color: 'var(--color-accent)' },
  { grade: 'easy', label: '簡単', color: 'var(--color-primary)' },
];

export function ReviewControls({ onGrade }: ReviewControlsProps) {
  return (
    <div className="review-controls">
      {GRADE_BUTTONS.map(({ grade, label, color }) => (
        <button
          key={grade}
          className="btn"
          style={{ color, border: `1px solid ${color}` }}
          onClick={() => onGrade(grade)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
