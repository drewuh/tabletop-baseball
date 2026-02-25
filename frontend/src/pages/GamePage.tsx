import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameEngine } from '../hooks/useGameEngine';
import { useTeamTheme } from '../hooks/useTeamTheme';
import { Scoreboard } from '../components/Scoreboard/Scoreboard';
import { DiamondView } from '../components/Diamond/DiamondView';
import { AtBatPanel } from '../components/AtBat/AtBatPanel';
import { LineupPanel } from '../components/Lineup/LineupPanel';
import { PlayByPlayPanel } from '../components/PlayByPlay/PlayByPlayPanel';

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { gameState, rollResult, playResult, isLoading, isRolling, error, rollDice } =
    useGameEngine(gameId ?? '');

  const [mobilePanel, setMobilePanel] = useState<'lineup' | 'log'>('lineup');

  // Always call hooks before any early returns
  const { homeTheme, awayTheme } = useTeamTheme(
    gameState?.homeTeam.id ?? '',
    gameState?.awayTeam.id ?? '',
    gameState?.homeTeam.primary_color,
    gameState?.awayTeam.primary_color,
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading game…
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
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

  // When away is batting (top inning), use away accent color for diamond runners
  const diamondAccentHex = isTopInning ? awayTheme.accentHex : homeTheme.accentHex;

  // Batter team theme = away when top inning, home when bottom
  const batterTheme = isTopInning ? awayTheme : homeTheme;
  // Pitcher team theme = home when top inning, away when bottom
  const pitcherTheme = isTopInning ? homeTheme : awayTheme;

  return (
    <div className="flex-1 flex flex-col text-zinc-100">
      {/* Scoreboard */}
      <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center justify-end mb-2">
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
          homeTheme={homeTheme}
          awayTheme={awayTheme}
          phase={gameState.phase}
        />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 gap-4 px-4 py-4 min-h-0">
        {/* Away lineup — hidden on mobile */}
        <div className="hidden lg:block w-48 shrink-0">
          <LineupPanel
            team={awayTeam}
            lineup={awayLineup}
            currentBatterIndex={awayBatterIndex}
            side="away"
          />
        </div>

        {/* Center: diamond + at-bat */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <DiamondView
            baseRunners={gameState.baseRunners}
            outs={gameState.outs}
            accentHex={diamondAccentHex}
          />
          {activeBatter && activePitcher && (
            <AtBatPanel
              batter={activeBatter}
              pitcher={activePitcher}
              rollResult={rollResult}
              playResult={playResult}
              onRollDice={rollDice}
              isRolling={isRolling}
              isPlayerTurn={isPlayerTurn && gameState.phase === 'active'}
              batterTheme={batterTheme}
              pitcherTheme={pitcherTheme}
              accentHex={batterTheme.accentHex}
            />
          )}

          {/* Mobile toggle buttons */}
          <div className="lg:hidden flex gap-2">
            <button
              onClick={() => setMobilePanel('lineup')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded transition-colors cursor-pointer ${
                mobilePanel === 'lineup'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Lineup
            </button>
            <button
              onClick={() => setMobilePanel('log')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded transition-colors cursor-pointer ${
                mobilePanel === 'log'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Log
            </button>
          </div>

          {/* Mobile panels */}
          <div className="lg:hidden">
            {mobilePanel === 'lineup' ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <LineupPanel
                    team={awayTeam}
                    lineup={awayLineup}
                    currentBatterIndex={awayBatterIndex}
                    side="away"
                  />
                </div>
                <div className="flex-1">
                  <LineupPanel
                    team={homeTeam}
                    lineup={homeLineup}
                    currentBatterIndex={homeBatterIndex}
                    side="home"
                  />
                </div>
              </div>
            ) : (
              <PlayByPlayPanel entries={gameState.log} isLive />
            )}
          </div>

          {/* Play-by-play on medium screens (below xl, above lg) */}
          <div className="hidden lg:block xl:hidden">
            <PlayByPlayPanel entries={gameState.log} isLive />
          </div>
        </div>

        {/* Play-by-play: third column on xl */}
        <div className="hidden xl:flex w-72 shrink-0">
          <PlayByPlayPanel entries={gameState.log} isLive />
        </div>

        {/* Home lineup — hidden on mobile */}
        <div className="hidden lg:block w-48 shrink-0">
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
