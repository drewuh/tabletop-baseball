import { Player } from '../../types/player';
import { RollResult, PlayResult } from '../../types/game';
import { DiceDisplay } from './DiceDisplay';
import { RollDiceButton } from './RollDiceButton';
import { PlayResultDisplay } from './PlayResultDisplay';

interface AtBatPanelProps {
  batter: Player;
  pitcher: Player;
  rollResult: RollResult | null;
  playResult: PlayResult | null;
  onRollDice: () => void;
  isRolling: boolean;
  isPlayerTurn: boolean;
}

export function AtBatPanel({
  batter,
  pitcher,
  rollResult,
  playResult,
  onRollDice,
  isRolling,
  isPlayerTurn,
}: AtBatPanelProps) {
  return (
    <div className="border border-zinc-700 rounded p-4 flex flex-col gap-4 bg-zinc-900">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">
          Batter: <span className="text-zinc-100 font-semibold">{batter.name}</span>
        </span>
        <span className="text-zinc-400">
          Pitcher: <span className="text-zinc-100 font-semibold">{pitcher.name}</span>
        </span>
      </div>
      <DiceDisplay rollResult={rollResult} isRolling={isRolling} />
      <RollDiceButton onRoll={onRollDice} isRolling={isRolling} isPlayerTurn={isPlayerTurn} />
      <PlayResultDisplay result={playResult} />
    </div>
  );
}
