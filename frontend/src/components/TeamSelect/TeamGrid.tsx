import type { Team } from '../../types/team';
import { TeamCard } from './TeamCard';

interface TeamGridProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamGrid({ teams, selectedTeamId, onSelectTeam }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          isSelected={selectedTeamId === team.id}
          onSelect={onSelectTeam}
        />
      ))}
    </div>
  );
}
