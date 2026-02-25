import { useState, useEffect } from 'react';
import type { CompletedGame } from '../types/history';
import { GameHistoryList } from '../components/History/GameHistoryList';

export default function HistoryPage() {
  const [games, setGames] = useState<CompletedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/games')
      .then(r => r.json())
      .then((data: CompletedGame[]) => setGames(data))
      .catch(() => setError('Failed to load game history.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Game History</h1>
      <GameHistoryList games={games} />
    </div>
  );
}
