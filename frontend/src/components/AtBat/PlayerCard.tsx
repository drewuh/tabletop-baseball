import type { PlayerCardData } from '../../types/playerCard';
import type { TeamTheme } from '../../types/theme';

interface PlayerCardProps {
  card: PlayerCardData;
  activeCol: number | null;
  activeRow: number | null;
  isActiveDeck: boolean;
  theme: TeamTheme;
}

function resultColor(result: string): string {
  if (['SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN'].includes(result)) return 'text-green-400';
  if (result === 'WALK') return 'text-sky-400';
  return 'text-zinc-400';
}

function abbrev(result: string): string {
  const map: Record<string, string> = {
    SINGLE: '1B', DOUBLE: '2B', TRIPLE: '3B', HOME_RUN: 'HR',
    WALK: 'BB', STRIKEOUT: 'K', GROUND_OUT: 'GO', FLY_OUT: 'FO', LINE_OUT: 'LO',
  };
  return map[result] ?? result;
}

export function PlayerCard({ card, activeCol, activeRow, isActiveDeck, theme }: PlayerCardProps) {
  const borderColor = isActiveDeck ? theme.accentHex : '#3f3f46';
  const headerBg = theme.primaryHex + '33'; // 20% opacity tint
  const cardTypeLabel = card.isPitcher ? 'PITCHER CARD' : 'BATTER CARD';

  return (
    <div
      className="w-full max-w-56 sm:w-56 bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all duration-200"
      style={{ borderColor }}
    >
      {/* Header */}
      <div className="px-3 py-2" style={{ backgroundColor: headerBg }}>
        <div className="text-sm font-bold text-zinc-100 truncate">{card.playerName}</div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-zinc-400">{card.position} · {card.teamAbbreviation}</span>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {cardTypeLabel}
          </span>
        </div>
      </div>

      {/* 6×6 grid */}
      <div className="px-2 py-1.5">
        {/* Column header row */}
        <div className="grid grid-cols-7 mb-0.5">
          <div className="text-[10px] font-mono text-zinc-600" /> {/* empty corner */}
          {[1,2,3,4,5,6].map(c => (
            <div key={c} className="text-[10px] font-mono text-zinc-500 text-center">{c}</div>
          ))}
        </div>
        {/* Data rows */}
        {[1,2,3,4,5,6].map(rowNum => (
          <div key={rowNum} className="grid grid-cols-7">
            {/* Row label */}
            <div className="text-[10px] font-mono text-zinc-500 flex items-center">{rowNum}</div>
            {/* Cells */}
            {[1,2,3,4,5,6].map(colNum => {
              const cell = card.rows.find(r => r.col === colNum && r.row === rowNum);
              const isActive = colNum === activeCol && rowNum === activeRow && isActiveDeck;
              return (
                <div
                  key={colNum}
                  className={`text-[10px] font-mono text-center py-0.5 rounded-sm ${
                    isActive ? 'bg-amber-400/20 text-amber-300' : resultColor(cell?.result ?? '')
                  }`}
                >
                  {abbrev(cell?.result ?? '')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
