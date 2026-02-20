import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GameState, InningScore } from '../types/game';
import { ResultBanner } from '../components/GameResult/ResultBanner';
import { Scoreboard } from '../components/Scoreboard/Scoreboard';

export default function GameResultPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    fetch(`/api/games/${gameId}/state`)
      .then(res => res.json())
      .then((data: GameState) => setGameState(data));
  }, [gameId]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  }

  const playerRuns = gameState.innings
    .filter((s: InningScore) => s.is_top === 0)
    .reduce((a: number, s: InningScore) => a + s.runs, 0);
  const cpuRuns = gameState.innings
    .filter((s: InningScore) => s.is_top === 1)
    .reduce((a: number, s: InningScore) => a + s.runs, 0);
  const playerWon = playerRuns > cpuRuns;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-8 px-8 text-zinc-100">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <ResultBanner
          playerTeam={gameState.homeTeam}
          cpuTeam={gameState.awayTeam}
          playerRuns={playerRuns}
          cpuRuns={cpuRuns}
          playerWon={playerWon}
        />
        <Scoreboard
          homeTeam={gameState.homeTeam}
          awayTeam={gameState.awayTeam}
          innings={gameState.innings}
          currentInning={gameState.currentInning}
          isTopInning={gameState.isTopInning}
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded font-bold text-sm tracking-widest uppercase bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded font-bold text-sm tracking-widest uppercase border border-zinc-600 text-zinc-300 hover:border-zinc-400 cursor-pointer"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
