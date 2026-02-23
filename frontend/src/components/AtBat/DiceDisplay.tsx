import '../../styles/dice.css';
import type { RollResult } from '../../types/game';
import { Die } from './Die';

interface DiceRollerProps {
  rollResult: RollResult | null;
  isRolling: boolean;
  accentHex?: string;
}

export function DiceRoller({ rollResult, isRolling, accentHex }: DiceRollerProps) {
  const cardLabel = rollResult?.usedBatterCard ? 'BATTER CARD' : 'PITCHER CARD';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-4 justify-center">
        <Die
          sides={20}
          value={rollResult?.d20 ?? null}
          isRolling={isRolling}
          accentHex={accentHex}
        />
        <Die
          sides={6}
          value={rollResult?.d6a ?? null}
          isRolling={isRolling}
          accentHex={accentHex}
        />
        <Die
          sides={6}
          value={rollResult?.d6b ?? null}
          isRolling={isRolling}
          accentHex={accentHex}
        />
      </div>
      {rollResult && !isRolling && (
        <span className="text-xs text-zinc-400 font-mono">
          {cardLabel}
        </span>
      )}
    </div>
  );
}

/** @deprecated Use DiceRoller instead */
export function DiceDisplay({ rollResult, isRolling, accentHex }: DiceRollerProps) {
  return <DiceRoller rollResult={rollResult} isRolling={isRolling} accentHex={accentHex} />;
}
