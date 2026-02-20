import { useParams, useNavigate } from 'react-router-dom';
import { useGameEngine } from '../hooks/useGameEngine';
import { Scoreboard } from '../components/Scoreboard/Scoreboard';
import { DiamondView } from '../components/Diamond/DiamondView';
import { AtBatPanel } from '../components/AtBat/AtBatPanel';
import { LineupPanel } from '../components/Lineup/LineupPanel';
import { GameLog } from '../components/GameLog/GameLog';

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { gameState, rollResult, playResult, isLoading, isRolling, error, rollDice } =
    useGameEngine(gameId ?? '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading game…
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400">
        {error ?? 'Game not found.'}
      </div>
    );
  }

  const { homeTeam, awayTeam, homeLineup, awayLineup, homeBatterIndex, awayBatterIndex } = gameState;
  const isTopInning = gameState.isTopInning;

  // Active batter and pitcher
  const battingLineup = isTopInning ? awayLineup : homeLineup;
  const batterIdx = isTopInning ? awayBatterIndex : homeBatterIndex;
  const activeBatter = battingLineup[batterIdx % battingLineup.length];
  const activePitcher = isTopInning ? homeTeam.currentPitcher : awayTeam.currentPitcher;

  // Player is home team — player turn is bottom of inning
  const isPlayerTurn = !isTopInning;

  const halfLabel = isTopInning ? 'Top' : 'Bot';
  const inningLabel = `${halfLabel} ${gameState.currentInning}`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100">
      {/* Scoreboard */}
      <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-sm text-zinc-400">{inningLabel}</span>
          {gameState.phase === 'complete' && (
            <button
              onClick={() => navigate(`/game/${gameId}/result`)}
              className="text-sm bg-amber-500 text-zinc-950 px-3 py-1 rounded font-bold hover:bg-amber-400 cursor-pointer"
            >
              Final Score →
            </button>
          )}
        </div>
        <Scoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          innings={gameState.innings}
          currentInning={gameState.currentInning}
          isTopInning={isTopInning}
        />
      </div>

      {/* Main layout: three columns */}
      <div className="flex flex-1 gap-4 px-4 py-4 min-h-0">
        {/* Away lineup */}
        <div className="w-48 shrink-0">
          <LineupPanel
            team={awayTeam}
            lineup={awayLineup}
            currentBatterIndex={awayBatterIndex}
            side="away"
          />
        </div>

        {/* Center: diamond + at-bat + log */}
        <div className="flex-1 flex flex-col gap-4">
          <DiamondView baseRunners={gameState.baseRunners} outs={gameState.outs} />
          {activeBatter && activePitcher && (
            <AtBatPanel
              batter={activeBatter}
              pitcher={activePitcher}
              rollResult={rollResult}
              playResult={playResult}
              onRollDice={rollDice}
              isRolling={isRolling}
              isPlayerTurn={isPlayerTurn && gameState.phase === 'active'}
            />
          )}
          <GameLog entries={gameState.log} />
        </div>

        {/* Home lineup */}
        <div className="w-48 shrink-0">
          <LineupPanel
            team={homeTeam}
            lineup={homeLineup}
            currentBatterIndex={homeBatterIndex}
            side="home"
          />
        </div>
      </div>
    </div>
  );
}
