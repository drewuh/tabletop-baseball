import { Link } from 'react-router-dom';

interface AddPlayerButtonProps {
  teamId: string;
}

export function AddPlayerButton({ teamId }: AddPlayerButtonProps) {
  return (
    <Link
      to={`/editor/players/new?teamId=${teamId}`}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium rounded transition-colors min-h-[44px]"
    >
      + Add Player
    </Link>
  );
}
