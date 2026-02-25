import { useState } from 'react';
import type { Team } from '../../types/team';
import { teamThemes, fallbackTheme } from '../../lib/teamThemes';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onSelect: (teamId: string) => void;
}

export function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
  const theme = teamThemes[team.id] ?? fallbackTheme;
  const [hovered, setHovered] = useState(false);

  const borderStyle = isSelected
    ? { borderColor: theme.primaryHex, boxShadow: '0 0 0 2px ' + theme.primaryHex }
    : hovered
    ? { borderColor: theme.primaryHex + '99' }
    : { borderColor: theme.primaryHex + '55' };

  const selectedClass = isSelected
    ? 'w-full p-6 rounded-xl border-2 text-left transition-colors duration-150 cursor-pointer bg-zinc-900 hover:bg-zinc-800'
    : 'w-full p-6 rounded-xl border text-left transition-colors duration-150 cursor-pointer bg-zinc-900 hover:bg-zinc-800';

  return (
    <button
      onClick={() => onSelect(team.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={selectedClass}
      style={borderStyle}
    >
      <span
        className="inline-block px-2 py-0.5 rounded font-mono text-xs uppercase tracking-widest mb-3"
        style={{ color: theme.accentHex, backgroundColor: theme.primaryHex + '33' }}
      >
        {team.abbreviation}
      </span>
      <div className="font-bold text-lg text-zinc-100 leading-tight">{team.city}</div>
      <div className="text-zinc-400 text-sm mt-0.5">{team.name}</div>
      <div className="text-zinc-400 text-sm mt-2">
        {(team.wins ?? 0)}–{(team.losses ?? 0)}
      </div>
    </button>
  );
}
