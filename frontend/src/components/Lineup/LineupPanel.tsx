import { Player } from '../../types/player';
import { TeamInfo } from '../../types/game';
import { LineupRow } from './LineupRow';

interface LineupPanelProps {
  team: TeamInfo;
  lineup: Player[];
  currentBatterIndex: number;
  side: 'home' | 'away';
}

export function LineupPanel({ team, lineup, currentBatterIndex, side }: LineupPanelProps) {
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest px-2 pb-1 border-b border-zinc-700">
        {side === 'away' ? 'Away' : 'Home'} — {team.abbreviation}
      </div>
      <div className="flex flex-col gap-0.5">
        {lineup.map((player, i) => (
          <LineupRow
            key={player.id}
            player={player}
            battingOrder={i + 1}
            isActive={i === currentBatterIndex % lineup.length}
          />
        ))}
      </div>
      <div className="mt-2 px-2 text-xs text-zinc-500 font-mono">
        SP: {team.currentPitcher.name}
      </div>
    </div>
  );
}
