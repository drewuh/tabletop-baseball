import type { Player } from '../../types/player';

interface LineupRowProps {
  player: Player;
  battingOrder: number;
  isActive: boolean;
}

export function LineupRow({ player, battingOrder, isActive }: LineupRowProps) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 text-sm rounded ${
        isActive
          ? 'bg-amber-500/20 border-l-2 border-amber-400 text-zinc-100'
          : 'text-zinc-400 border-l-2 border-transparent'
      }`}
    >
      <span className="font-mono w-4 text-right text-zinc-500">{battingOrder}</span>
      <span className={`flex-1 font-semibold ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>
        {player.name}
      </span>
      <span className="font-mono text-xs text-zinc-500">{player.position}</span>
    </div>
  );
}
