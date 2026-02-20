import type { PlayerCardData } from '../../types/playerCard';
import type { TeamTheme } from '../../types/theme';

interface PlayerCardProps {
  card: PlayerCardData;
  activeRow: number | null;
  isActiveDeck: boolean;
  theme: TeamTheme;
}

function resultColor(result: string): string {
  if (['SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN'].includes(result)) return 'text-green-400';
  if (result === 'WALK') return 'text-sky-400';
  return 'text-zinc-400';
}

export function PlayerCard({ card, activeRow, isActiveDeck, theme }: PlayerCardProps) {
  const borderColor = isActiveDeck ? theme.accentHex : '#3f3f46';
  const headerBg = theme.primaryHex + '33'; // 20% opacity tint
  const cardTypeLabel = card.isPitcher ? 'PITCHER CARD' : 'BATTER CARD';

  return (
    <div
      className="w-56 bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all duration-200"
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

      {/* Card rows table */}
      <div className="px-0 py-1">
        {card.rows.map(row => {
          const isActive = row.d6_sum === activeRow && isActiveDeck;
          return (
            <div
              key={row.d6_sum}
              className={`flex px-3 py-0.5 text-xs font-mono transition-colors duration-150 ${
                isActive
                  ? 'bg-amber-400/20 border-l-2 border-amber-400'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <span className={`w-8 shrink-0 ${isActive ? 'text-amber-300' : 'text-zinc-500'}`}>
                {row.d6_sum}
              </span>
              <span className={isActive ? 'text-amber-300' : resultColor(row.result)}>
                {row.result.replace(/_/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
