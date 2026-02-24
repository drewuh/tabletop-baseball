import { Link } from 'react-router-dom';
import type { PlayerEditorData } from '../../types/editor';

interface PlayerListRowProps {
  player: PlayerEditorData;
}

export function PlayerListRow({ player }: PlayerListRowProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-800/60 rounded px-3 py-2">
      <div>
        <span className="text-zinc-100 text-sm font-medium">{player.name}</span>
        <span className="ml-2 text-zinc-500 text-xs">{player.position}</span>
      </div>
      <Link
        to={`/editor/players/${player.id}`}
        className="text-amber-300 hover:text-amber-200 text-xs font-medium transition-colors min-h-[44px] flex items-center px-2"
      >
        Edit
      </Link>
    </div>
  );
}
