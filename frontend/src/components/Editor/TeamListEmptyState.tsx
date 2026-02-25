import { Link } from 'react-router-dom';

export function TeamListEmptyState() {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div className="text-zinc-600 text-5xl">⚾</div>
      <p className="text-zinc-400 text-sm">No teams yet. Create your first team to get started.</p>
      <Link
        to="/editor/teams/new"
        className="px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold text-sm rounded hover:bg-amber-400 transition-colors min-h-[44px] flex items-center"
      >
        Create Team
      </Link>
    </div>
  );
}
