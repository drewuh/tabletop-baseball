import type { InningScore, ScoreTotals, GamePhase } from '../../types/game';
import type { Team } from '../../types/team';
import type { TeamTheme } from '../../types/theme';

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  innings: InningScore[];
  currentInning: number;
  isTopInning: boolean;
  totalInnings?: number;
  homeTheme?: TeamTheme;
  awayTheme?: TeamTheme;
  phase?: GamePhase;
}

function getTotals(innings: InningScore[], isTop: boolean): ScoreTotals {
  const rows = innings.filter(s => (s.is_top === 1) === isTop);
  return {
    runs: rows.reduce((a, s) => a + s.runs, 0),
    hits: rows.reduce((a, s) => a + s.hits, 0),
    errors: rows.reduce((a, s) => a + s.errors, 0),
  };
}

function getInningRuns(innings: InningScore[], inning: number, isTop: boolean): number | null {
  const row = innings.find(s => s.inning === inning && (s.is_top === 1) === isTop);
  return row ? row.runs : null;
}

interface InningCellProps {
  inning: number;
  isTopRow: boolean;
  innings: InningScore[];
  currentInning: number;
  isTopInning: boolean;
}

function InningCell({ inning, isTopRow, innings, currentInning, isTopInning }: InningCellProps) {
  const runs = getInningRuns(innings, inning, isTopRow);
  const isActive =
    inning === currentInning &&
    ((isTopRow && isTopInning) || (!isTopRow && !isTopInning));

  let textClass: string;
  let display: string;

  if (runs === null) {
    textClass = 'text-zinc-600';
    display = '—';
  } else if (runs === 0) {
    textClass = 'text-zinc-500';
    display = '0';
  } else {
    textClass = 'text-zinc-100 font-bold';
    display = String(runs);
  }

  if (isActive) {
    textClass = 'text-amber-400';
  }

  return (
    <td
      className={`px-1 py-1.5 text-center font-mono text-xs w-8 ${textClass} ${
        isActive ? 'bg-zinc-800' : ''
      }`}
    >
      {display}
    </td>
  );
}

export function Scoreboard({
  homeTeam,
  awayTeam,
  innings,
  currentInning,
  isTopInning,
  totalInnings = 9,
  homeTheme,
  awayTheme,
  phase,
}: ScoreboardProps) {
  const maxInning = Math.max(totalInnings, currentInning);
  const inningNumbers = Array.from({ length: maxInning }, (_, i) => i + 1);

  const awayTotals = getTotals(innings, true);
  const homeTotals = getTotals(innings, false);

  const halfLabel = isTopInning ? 'Top' : 'Bot';
  const inningLabel = `${halfLabel} ${currentInning}`;

  const isLive = phase === 'active';
  const isFinal = phase === 'complete';

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          {inningLabel}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                LIVE
              </span>
            </>
          )}
          {isFinal && (
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              FINAL
            </span>
          )}
        </div>
      </div>

      {/* Scoreboard table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Column headers */}
          <thead>
            <tr className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              <th className="text-left px-3 py-1.5 w-24">TEAM</th>
              {inningNumbers.map(n => (
                <th
                  key={n}
                  className={`px-1 py-1.5 text-center w-8 ${
                    n === currentInning ? 'text-amber-400' : ''
                  }`}
                >
                  {n}
                </th>
              ))}
              <th className="px-2 py-1.5 text-center w-8">R</th>
              <th className="px-2 py-1.5 text-center w-8">H</th>
              <th className="px-2 py-1.5 text-center w-8">E</th>
            </tr>
          </thead>
          <tbody>
            {/* Away row */}
            <tr>
              <td className="px-3 py-1.5">
                <div
                  className="text-sm font-bold"
                  style={{ color: awayTheme?.accentHex ?? '#f59e0b' }}
                >
                  {awayTeam.abbreviation}
                </div>
                <div className="text-xs text-zinc-500">{awayTeam.city} {awayTeam.name}</div>
              </td>
              {inningNumbers.map(n => (
                <InningCell
                  key={n}
                  inning={n}
                  isTopRow={true}
                  innings={innings}
                  currentInning={currentInning}
                  isTopInning={isTopInning}
                />
              ))}
              <td
                className="px-2 py-1.5 text-center font-mono text-sm font-bold text-amber-400"
                style={{ borderLeft: `2px solid ${awayTheme?.primaryHex ?? '#f59e0b'}` }}
              >
                {awayTotals.runs}
              </td>
              <td className="px-2 py-1.5 text-center font-mono text-xs text-zinc-400">
                {awayTotals.hits}
              </td>
              <td className="px-2 py-1.5 text-center font-mono text-xs text-zinc-400">
                {awayTotals.errors}
              </td>
            </tr>

            {/* Divider */}
            <tr>
              <td
                colSpan={inningNumbers.length + 4}
                className="border-t border-zinc-800 p-0"
              />
            </tr>

            {/* Home row */}
            <tr>
              <td className="px-3 py-1.5">
                <div
                  className="text-sm font-bold"
                  style={{ color: homeTheme?.accentHex ?? '#f59e0b' }}
                >
                  {homeTeam.abbreviation}
                </div>
                <div className="text-xs text-zinc-500">{homeTeam.city} {homeTeam.name}</div>
              </td>
              {inningNumbers.map(n => (
                <InningCell
                  key={n}
                  inning={n}
                  isTopRow={false}
                  innings={innings}
                  currentInning={currentInning}
                  isTopInning={isTopInning}
                />
              ))}
              <td
                className="px-2 py-1.5 text-center font-mono text-sm font-bold text-amber-400"
                style={{ borderLeft: `2px solid ${homeTheme?.primaryHex ?? '#f59e0b'}` }}
              >
                {homeTotals.runs}
              </td>
              <td className="px-2 py-1.5 text-center font-mono text-xs text-zinc-400">
                {homeTotals.hits}
              </td>
              <td className="px-2 py-1.5 text-center font-mono text-xs text-zinc-400">
                {homeTotals.errors}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
