import { InningScore, ScoreTotals } from '../../types/game';
import { Team } from '../../types/team';

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  innings: InningScore[];
  currentInning: number;
  isTopInning: boolean;
  totalInnings?: number;
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

export function Scoreboard({
  homeTeam,
  awayTeam,
  innings,
  currentInning,
  isTopInning,
  totalInnings = 9,
}: ScoreboardProps) {
  const maxInning = Math.max(totalInnings, currentInning);
  const inningNumbers = Array.from({ length: maxInning }, (_, i) => i + 1);

  const awayTotals = getTotals(innings, true);
  const homeTotals = getTotals(innings, false);

  function cellRuns(inning: number, isTopRow: boolean): string {
    const runs = getInningRuns(innings, inning, isTopRow);
    if (runs === null) return '-';
    return String(runs);
  }

  function isActive(inning: number): boolean {
    return inning === currentInning;
  }

  return (
    <div className="overflow-x-auto">
      <table className="font-mono text-sm border-collapse w-full">
        <thead>
          <tr className="text-zinc-400 text-xs uppercase tracking-widest">
            <th className="text-left px-3 py-1 w-20">Team</th>
            {inningNumbers.map(n => (
              <th
                key={n}
                className={`px-2 py-1 text-center w-8 ${isActive(n) ? 'text-zinc-100' : ''}`}
              >
                {n}
              </th>
            ))}
            <th className="px-3 py-1 text-center">R</th>
            <th className="px-3 py-1 text-center">H</th>
            <th className="px-3 py-1 text-center">E</th>
          </tr>
        </thead>
        <tbody>
          {/* Away row */}
          <tr className="border-t border-zinc-700">
            <td className="px-3 py-1 text-zinc-100 font-semibold">{awayTeam.abbreviation}</td>
            {inningNumbers.map(n => (
              <td
                key={n}
                className={`px-2 py-1 text-center ${
                  isActive(n) && isTopInning ? 'text-zinc-100' : 'text-zinc-300'
                }`}
              >
                {cellRuns(n, true)}
              </td>
            ))}
            <td className="px-3 py-1 text-center text-amber-400 font-semibold">{awayTotals.runs}</td>
            <td className="px-3 py-1 text-center text-zinc-300">{awayTotals.hits}</td>
            <td className="px-3 py-1 text-center text-zinc-300">{awayTotals.errors}</td>
          </tr>
          {/* Home row */}
          <tr className="border-t border-zinc-700">
            <td className="px-3 py-1 text-zinc-100 font-semibold">{homeTeam.abbreviation}</td>
            {inningNumbers.map(n => (
              <td
                key={n}
                className={`px-2 py-1 text-center ${
                  isActive(n) && !isTopInning ? 'text-zinc-100' : 'text-zinc-300'
                }`}
              >
                {cellRuns(n, false)}
              </td>
            ))}
            <td className="px-3 py-1 text-center text-amber-400 font-semibold">{homeTotals.runs}</td>
            <td className="px-3 py-1 text-center text-zinc-300">{homeTotals.hits}</td>
            <td className="px-3 py-1 text-center text-zinc-300">{homeTotals.errors}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
