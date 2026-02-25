import { Link } from 'react-router-dom';
import type { TeamEditorData } from '../../types/editor';

interface TeamListRowProps {
  team: TeamEditorData;
}

export function TeamListRow({ team }: TeamListRowProps) {
  const wins = team.wins ?? 0;
  const losses = team.losses ?? 0;

  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-8 rounded-sm shrink-0"
          style={{ backgroundColor: team.primary_color }}
        />
        <div>
          <div className="text-zinc-100 font-semibold">
            {team.city} {team.name}
          </div>
          <div className="text-zinc-500 text-xs">
            {team.abbreviation} · {wins}–{losses}
          </div>
        </div>
      </div>
      <Link
        to={`/editor/teams/${team.id}`}
        className="text-amber-300 hover:text-amber-200 text-sm font-medium transition-colors min-h-[44px] flex items-center px-2"
      >
        Edit →
      </Link>
    </div>
  );
}
