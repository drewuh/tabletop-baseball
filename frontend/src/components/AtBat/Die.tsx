import '../../styles/dice.css';

interface DieProps {
  sides: 6 | 20;
  value: number | null;
  isRolling: boolean;
  accentHex?: string;
}

export function Die({ sides, value, isRolling, accentHex }: DieProps) {
  const sizeClass = sides === 20 ? 'w-16 h-16' : 'w-14 h-14';
  const label = sides === 20 ? 'D20' : 'D6';

  const borderStyle =
    !isRolling && value !== null && accentHex
      ? { borderColor: accentHex }
      : undefined;

  const animationClass = isRolling ? 'dice-rolling' : value !== null ? 'dice-settle' : '';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${sizeClass} bg-zinc-800 border-2 border-zinc-600 rounded-lg flex items-center justify-center font-mono font-bold text-zinc-100 text-xl ${animationClass}`}
        style={borderStyle}
      >
        {isRolling ? '?' : (value ?? '—')}
      </div>
      <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">{label}</span>
    </div>
  );
}
