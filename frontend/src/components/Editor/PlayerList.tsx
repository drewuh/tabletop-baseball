import type { PlayerEditorData } from '../../types/editor';
import { PlayerListRow } from './PlayerListRow';

interface PlayerListProps {
  players: PlayerEditorData[];
}

export function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <p className="text-zinc-500 text-sm py-4">
        No players yet. Add batters and a pitcher to complete this roster.
      </p>
    );
  }

  const batters = players.filter(p => !p.is_pitcher).sort((a, b) => (a.batting_order ?? 99) - (b.batting_order ?? 99));
  const pitchers = players.filter(p => p.is_pitcher);

  return (
    <div className="flex flex-col gap-1">
      {batters.length > 0 && (
        <>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-1 pt-2 pb-1">
            Batters ({batters.length}/9)
          </div>
          {batters.map(p => <PlayerListRow key={p.id} player={p} />)}
        </>
      )}
      {pitchers.length > 0 && (
        <>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-1 pt-2 pb-1">
            Pitchers ({pitchers.length}/1)
          </div>
          {pitchers.map(p => <PlayerListRow key={p.id} player={p} />)}
        </>
      )}
    </div>
  );
}
