import type {
  BattingStatRow,
  PitchingStatRow,
  BattingSortKey,
  PitchingSortKey,
  SortDirection,
} from '../../types/stats';

function sortIndicator(isActive: boolean, dir: SortDirection): string {
  if (!isActive) return '↕';
  return dir === 'asc' ? '↑' : '↓';
}

function formatBA(val: number | null): string {
  if (val === null) return '—';
  return val.toFixed(3).replace(/^0/, '');
}

function formatIP(outs: number): string {
  return `${Math.floor(outs / 3)}.${outs % 3}`;
}

// ── Batting table ──────────────────────────────────────────────

interface BattingTableProps {
  rows: BattingStatRow[];
  sortKey: BattingSortKey;
  sortDirection: SortDirection;
  onSort: (key: BattingSortKey) => void;
}

const BATTING_COLS: { key: BattingSortKey; label: string }[] = [
  { key: 'playerName',     label: 'Player' },
  { key: 'teamName',       label: 'Team'   },
  { key: 'gamesPlayed',    label: 'G'      },
  { key: 'atBats',         label: 'AB'     },
  { key: 'hits',           label: 'H'      },
  { key: 'homeRuns',       label: 'HR'     },
  { key: 'rbi',            label: 'RBI'    },
  { key: 'walks',          label: 'BB'     },
  { key: 'strikeouts',     label: 'K'      },
  { key: 'battingAverage', label: 'AVG'    },
];

function BattingTable({ rows, sortKey, sortDirection, onSort }: BattingTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
          {BATTING_COLS.map(col => (
            <th
              key={col.key}
              onClick={() => onSort(col.key)}
              className={`px-3 py-2 whitespace-nowrap cursor-pointer select-none hover:text-zinc-200 transition-colors ${
                col.key === 'playerName' ? 'text-left' : 'text-right'
              }`}
            >
              {col.label} {sortIndicator(sortKey === col.key, sortDirection)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.playerId}
            className={i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800/50'}
          >
            <td className="px-3 py-2 text-zinc-100 font-medium whitespace-nowrap">{row.playerName}</td>
            <td
              className="px-3 py-2 text-zinc-400 whitespace-nowrap border-l-2 pl-3"
              style={{ borderLeftColor: row.primaryColor }}
            >
              {row.teamAbbreviation}
            </td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.gamesPlayed}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.atBats}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.hits}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.homeRuns}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.rbi}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.walks}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.strikeouts}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right font-medium">
              {formatBA(row.battingAverage)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Pitching table ─────────────────────────────────────────────

interface PitchingTableProps {
  rows: PitchingStatRow[];
  sortKey: PitchingSortKey;
  sortDirection: SortDirection;
  onSort: (key: PitchingSortKey) => void;
}

const PITCHING_COLS: { key: PitchingSortKey; label: string }[] = [
  { key: 'playerName',        label: 'Pitcher' },
  { key: 'teamName',          label: 'Team'    },
  { key: 'gamesPlayed',       label: 'G'       },
  { key: 'outsRecorded',      label: 'IP'      },
  { key: 'runsAllowed',       label: 'R'       },
  { key: 'strikeoutsPitched', label: 'K'       },
];

function PitchingTable({ rows, sortKey, sortDirection, onSort }: PitchingTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
          {PITCHING_COLS.map(col => (
            <th
              key={col.key}
              onClick={() => onSort(col.key)}
              className={`px-3 py-2 whitespace-nowrap cursor-pointer select-none hover:text-zinc-200 transition-colors ${
                col.key === 'playerName' ? 'text-left' : 'text-right'
              }`}
            >
              {col.label} {sortIndicator(sortKey === col.key, sortDirection)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.playerId}
            className={i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800/50'}
          >
            <td className="px-3 py-2 text-zinc-100 font-medium whitespace-nowrap">{row.playerName}</td>
            <td
              className="px-3 py-2 text-zinc-400 whitespace-nowrap border-l-2 pl-3"
              style={{ borderLeftColor: row.primaryColor }}
            >
              {row.teamAbbreviation}
            </td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.gamesPlayed}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{formatIP(row.outsRecorded)}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.runsAllowed}</td>
            <td className="px-3 py-2 text-zinc-300 tabular-nums text-right">{row.strikeoutsPitched}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Unified export ─────────────────────────────────────────────

interface StatsTableProps {
  mode: 'batting' | 'pitching';
  battingRows: BattingStatRow[];
  pitchingRows: PitchingStatRow[];
  battingSortKey: BattingSortKey;
  pitchingSortKey: PitchingSortKey;
  sortDirection: SortDirection;
  onBattingSort: (key: BattingSortKey) => void;
  onPitchingSort: (key: PitchingSortKey) => void;
}

export function StatsTable({
  mode,
  battingRows,
  pitchingRows,
  battingSortKey,
  pitchingSortKey,
  sortDirection,
  onBattingSort,
  onPitchingSort,
}: StatsTableProps) {
  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden overflow-x-auto">
      {mode === 'batting' ? (
        <BattingTable
          rows={battingRows}
          sortKey={battingSortKey}
          sortDirection={sortDirection}
          onSort={onBattingSort}
        />
      ) : (
        <PitchingTable
          rows={pitchingRows}
          sortKey={pitchingSortKey}
          sortDirection={sortDirection}
          onSort={onPitchingSort}
        />
      )}
    </div>
  );
}
