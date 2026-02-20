import type { RollResult } from '../../types/game';

interface DiceDisplayProps {
  rollResult: RollResult | null;
  isRolling: boolean;
}

function Die({ value, label, isRolling }: { value: number | null; label: string; isRolling: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-12 h-12 bg-zinc-100 text-zinc-900 rounded flex items-center justify-center font-mono font-bold text-lg ${
          isRolling ? 'animate-bounce' : ''
        }`}
      >
        {isRolling ? '?' : value ?? '-'}
      </div>
      <span className="text-xs text-zinc-400 font-mono">{label}</span>
    </div>
  );
}

export function DiceDisplay({ rollResult, isRolling }: DiceDisplayProps) {
  return (
    <div className="flex gap-4 justify-center">
      <Die value={rollResult?.d20 ?? null} label="d20" isRolling={isRolling} />
      <Die value={rollResult?.d6a ?? null} label="d6" isRolling={isRolling} />
      <Die value={rollResult?.d6b ?? null} label="d6" isRolling={isRolling} />
    </div>
  );
}
