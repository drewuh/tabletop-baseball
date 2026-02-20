import type { Player } from '../../types/player';
import type { RollResult, PlayResult } from '../../types/game';
import type { TeamTheme } from '../../types/theme';
import { DiceRoller } from './DiceDisplay';
import { RollDiceButton } from './RollDiceButton';
import { PlayResultDisplay } from './PlayResultDisplay';
import { PlayerCard } from './PlayerCard';
import { usePlayerCards } from '../../hooks/usePlayerCards';

interface AtBatPanelProps {
  batter: Player;
  pitcher: Player;
  rollResult: RollResult | null;
  playResult: PlayResult | null;
  onRollDice: () => void;
  isRolling: boolean;
  isPlayerTurn: boolean;
  batterTheme?: TeamTheme;
  pitcherTheme?: TeamTheme;
  accentHex?: string;
}

const defaultTheme: TeamTheme = { primaryHex: '#27272a', accentHex: '#f59e0b' };

export function AtBatPanel({
  batter,
  pitcher,
  rollResult,
  playResult,
  onRollDice,
  isRolling,
  isPlayerTurn,
  batterTheme = defaultTheme,
  pitcherTheme = defaultTheme,
  accentHex,
}: AtBatPanelProps) {
  const { batterCard, pitcherCard } = usePlayerCards({
    batterId: batter.id,
    pitcherId: pitcher.id,
  });

  const activeRow = rollResult?.d6Sum ?? null;
  const usedBatterCard = rollResult?.usedBatterCard ?? false;

  return (
    <div className="border border-zinc-700 rounded-lg p-4 flex flex-col gap-4 bg-zinc-900">
      {/* Batter / Pitcher name row */}
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">
          Batter: <span className="text-zinc-100 font-semibold">{batter.name}</span>
        </span>
        <span className="text-zinc-400">
          Pitcher: <span className="text-zinc-100 font-semibold">{pitcher.name}</span>
        </span>
      </div>

      {/* Player cards side by side */}
      {batterCard && pitcherCard && (
        <div className="flex gap-3 justify-center flex-wrap">
          <PlayerCard
            card={batterCard}
            activeRow={activeRow}
            isActiveDeck={usedBatterCard}
            theme={batterTheme}
          />
          <PlayerCard
            card={pitcherCard}
            activeRow={activeRow}
            isActiveDeck={!usedBatterCard && rollResult !== null}
            theme={pitcherTheme}
          />
        </div>
      )}

      {/* Dice display */}
      <DiceRoller rollResult={rollResult} isRolling={isRolling} accentHex={accentHex} />

      {/* Roll button */}
      <RollDiceButton onRoll={onRollDice} isRolling={isRolling} isPlayerTurn={isPlayerTurn} />

      {/* Play result */}
      <PlayResultDisplay result={playResult} />
    </div>
  );
}
