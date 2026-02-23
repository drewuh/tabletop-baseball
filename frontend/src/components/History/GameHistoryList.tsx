import type { CompletedGame } from '../../types/history';
import { GameHistoryRow } from './GameHistoryRow';

interface GameHistoryListProps {
  games: CompletedGame[];
}

export function GameHistoryList({ games }: GameHistoryListProps) {
  if (games.length === 0) {
    return (
      <p className="text-zinc-500 text-sm text-center py-12">No games played yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {games.map(game => (
        <GameHistoryRow key={game.gameId} game={game} />
      ))}
    </div>
  );
}
