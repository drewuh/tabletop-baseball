import { Team } from '../../types/team';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onSelect: (teamId: string) => void;
}

export function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
  return (
    <button
      onClick={() => onSelect(team.id)}
      className={`w-full p-6 rounded border text-left transition-colors duration-150 cursor-pointer ${
        isSelected
          ? 'border-amber-400 bg-zinc-800 ring-2 ring-amber-400'
          : 'border-zinc-700 bg-zinc-900 hover:border-amber-500 hover:bg-zinc-800'
      }`}
    >
      <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">
        {team.abbreviation}
      </div>
      <div className="font-bold text-lg text-zinc-100">{team.city}</div>
      <div className="text-zinc-400 text-sm">{team.name}</div>
    </button>
  );
}
