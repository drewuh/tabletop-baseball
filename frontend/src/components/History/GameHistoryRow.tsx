import { Link } from 'react-router-dom';
import type { CompletedGame } from '../../types/history';

interface GameHistoryRowProps {
  game: CompletedGame;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function GameHistoryRow({ game }: GameHistoryRowProps) {
  const homeWon = game.homeScore > game.awayScore;
  const awayWon = game.awayScore > game.homeScore;

  return (
    <div className="bg-zinc-800 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        {/* Score line */}
        <div className="flex items-center gap-2 text-lg font-bold">
          <span style={{ color: game.awayTeam.primaryColor }}>{game.awayTeam.name}</span>
          <span className={awayWon ? 'text-green-400' : 'text-zinc-400'}>{game.awayScore}</span>
          <span className="text-zinc-600 font-normal">–</span>
          <span className={homeWon ? 'text-green-400' : 'text-zinc-400'}>{game.homeScore}</span>
          <span style={{ color: game.homeTeam.primaryColor }}>{game.homeTeam.name}</span>
        </div>
        <div className="text-zinc-500 text-xs">{formatDate(game.playedAt)}</div>
      </div>
      <Link
        to={`/game/${game.gameId}/result`}
        className="text-amber-300 hover:text-amber-200 text-sm font-medium transition-colors"
      >
        View Result →
      </Link>
    </div>
  );
}
